/**
 * Created by chuso_000 on 16/8/2015.
 */
//module.exports = wordlistCommon;
angular.module('controllers')
    .factory('wordlistCommon', function () {
        return wordlistCommon;

        function wordlistCommon(){
            var vm = this;
            _.assign(vm,{
                playAudio: playAudio,
                refreshPage: refreshPage,
            });

            function playAudio(term, type){
                if (type==false){
                    if (!term.wordAudio)
                        term.wordAudio = new Audio(term.wordVoice);
                    term.wordAudio.play();
                    //term.wordAudio.play();
                }else if (type==true){
                    if (!term.meaningAudio)
                        term.meaningAudio = new Audio(term.meaningVoice);
                    term.meaningAudio.play();
                    //term.meaningAudio.play();
                }
                //this.$http({
                //    method:'GET',
                //    url: term.wordVoice,
                //    headers:{
                //        'responseType':'audio/mpeg',
                //        referrer:null
                //    }
                //}).then(function(rRes){
                //    console.log(rRes);
                //})
                //console.log(term.wordVoice);
            }
            function refreshPage(num){
                if (num) vm.openingPage = num;
                else vm.openingPage=1;

                vm.totalPages = Math.ceil(vm.currentWordlist.length/7);
                vm.$data = (vm.currentWordlist).slice((vm.openingPage - 1) * 7, vm.openingPage * 7);
            }
        }
    })
