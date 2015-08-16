/**
 * Created by chuso_000 on 16/8/2015.
 */

//module.exports = wordAPI;
angular.module('controllers')
    .factory('wordAPI', function ($q, Word, Folder, helper, yandexSupportedLangs) {
        return wordAPI;

        function wordAPI(){
            var vm = this;
            _.assign(vm,{
                addTerm: addTerm,
                enableEditTerm: enableEditTerm,
                editTerm: editTerm,
                deleteTerm: deleteTerm,
                defineWord: defineWord,
            })

            function addTerm(){
                var defer = $q.defer();
                defer.promise.then(function(res, err){
                    if (err) return console.error(err);
                    res.editing = false;
                    vm.resetForm();

                    //$scope.currentWordlist.push(res);
                    vm.currentWordlist.push(res);
                    //$scope.currentWordlist= orderByScoreFilter($scope.currentWordlist);
                    vm.currentWordlist= helper.orderByScoreFilter(vm.currentWordlist);
                    //this.currentWordlist = this.Word.words;
                    vm.refreshPage();
                    //
                    //this.$apply(function(){
                    //
                    //});
                });
                Word.addWord(vm.currentOpeningFolder, vm.newword, vm.newmeaning, vm.newexample, vm.newimage).then(function(res){
                    defer.resolve(res);
                });
            }
            function enableEditTerm(item){
                item.editing=true;
            }
            function editTerm(item) {
                item.editing = false;
                //console.log(item);
                Word.editWord(item._id, vm.currentOpeningFolder, item.word, item.meaning, item.example, item.image).then(function (res) {
                    //console.log(res);
                });
            }
            function deleteTerm(item){
                Word.deleteWord(item._id).then(function(res){
                    console.log('deleted');
                });
                vm.currentWordlist.splice(vm.currentWordlist.indexOf(item),1);
                vm.refreshPage();
                if (vm.wordCart && vm.wordCart.length>0){
                    //if (Word.wordCart.indexOf(item._id)!==-1){
                    if (vm.wordCart.indexOf(item)!==-1){
                        //Word.wordCart.splice(Word.wordCart.indexOf(item._id),1);
                        vm.wordCart.splice(vm.wordCart.indexOf(item),1);
                    }
                }
            }
            function defineWord(word){
                vm.loading.definition = true;
                var from,to;

                Folder.getFolderById(vm.currentOpeningFolder).then(function(res){
                    //console.log(res);
                    from = res.fromLang;
                    to = res.toLang;
                    return Word.defineWord(word, res.fromLang, res.toLang);
                }).then(function(res, err){
                    if (err) return console.error(err);
                    //console.log(res);
                    vm.loading.definition=false;
                    if (yandexSupportedLangs.indexOf(from, to))
                        vm.newexample=res;
                    else
                        vm.newmeaning = res;
                });

                //this.Word.defineWord(word, currentFolder.fromLang, currentFolder.toLang)
            }
        }
    });
