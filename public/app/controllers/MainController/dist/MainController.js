/**
 * Created by chuso_000 on 15/8/2015.
 */

//module.exports = folderAPI;
angular.module('controllers')
    .factory('folderAPI', function (Folder, helper) {
        return folderAPI;

        function folderAPI(){
            var vm = this;

            _.assign(vm, {
                formatDate: formatDate,
                editFolder: editFolder,
                addFolder: addFolder,
                deleteFolder: deleteFolder,
                decodeLang: Folder.decodeLang,
            })

            function formatDate(date){
                return helper.formatDate(date);
            }
            function editFolder(folder, index){
                //return true;
                return Folder.editFolder(folder).then(function(res){
                    vm.folders[index].editing=false;
                })
            }
            function addFolder(){
                Folder.addFolder(this.newnameF, this.newfromLangF, this.newtoLangF).then(function(res){
                    console.log(res);
                    vm.folders.push(res.data);
                    vm.folders = vm.folders.sort(function(a,b){
                        return new Date(a.createdAt) < new Date(b.createdAt);
                    });
                    vm.newnameF = null;
                    vm.newfromLangF = null;
                    vm.newtoLangF = null;
                })
            }
            function deleteFolder(folder){
                Folder.deleteFolder(folder._id).then(function (res){
                    console.log(res);
                    if (res.data=='OK'){
                        _.remove(vm.folders, function(n){
                            return n==folder;
                        })
                    }
                });
            }
        }

    });

/**
 * Created by chuso_000 on 16/8/2015.
 */

//var folderAPI = require('./folder.API');
//var folderNavigation = require('./folder.navigation');
//module.exports = folder;
angular.module('controllers.mainController.folder',[])
    .factory('mainControllerFolder', function(folderAPI, folderNavigation){
        return folder;

        function folder(){
            var vm = this;
            vm.newnameF = null;
            vm.newfromLangF = null;
            vm.newtoLangF = null;

            folderAPI.call(vm);
            folderNavigation.call(vm);
        }
    });

/**
 * Created by chuso_000 on 16/8/2015.
 */

//module.exports = folderNavigation;
angular.module('controllers')
    .factory('folderNavigation', function ($state) {
        return folderNavigation;

        function folderNavigation(){
            var vm = this;
            _.assign(vm,{
                openFolder: openFolder,
                backToFolderSelection: backToFolderSelection,
            });

            function openFolder(folderId){
                $state.transitionTo('index',{fid: folderId},{notify:true});
            }
            function backToFolderSelection(){
                $state.transitionTo('index',{folder: undefined},{notify:true});
            }
        }
    });

/**
 * Created by chuso_000 on 15/8/2015.
 */

//var mainControllerFolder = require('./folder');
//var mainControllerWordlist = require('./wordlist');
//var mainControllerWord = require('./word');
//var mainControllerToTest = require('./toTest');

var app = angular.module('controllers');
app.controller('MainController', MainController);
//app.controller('MainController', function ($scope, $http, Word, Folder, AppLearnBridge, $state, $q, $stateParams, $timeout, helper, $anchorScroll, $location, yandexSupportedLangs) {
//
//});

function MainController(Word, Folder, $stateParams, mainControllerFolder, mainControllerWordlist, mainControllerWord, mainControllerToTest){
    var vm = this;

    vm.loadingDefinition = Word.loadingDefinition;

    //this.openingPage= 0;
    vm.wordCart = [];
    //console.log('$stateParams', $stateParams);

    mainControllerFolder.call(vm);
    mainControllerWordlist.call(vm);
    mainControllerWord.call(vm);
    mainControllerToTest.call(vm);
    activate();

    ////
    function activate(){
        //console.log('Let\' begin our journey');
        // Retrieve unread notification
        vm.loading = {
            definition :false,
            imageSuggestion : false,
            wordCollection: false
        };

        // Get folders
        if ($stateParams.fid){
            vm.currentOpeningFolder = $stateParams.fid;
            vm.getWords(vm.currentOpeningFolder);

        }else{

            Folder.getFolders().then(function (data){
                vm.folders = data;
                //console.log(data);
            });
        }
    }


}

/**
 * Created by chuso_000 on 16/8/2015.
 */
//var toTestStar = require('./toTest.star');
//module.exports = toTest;
angular.module('controllers.mainController.toTest',[])
    .factory('mainControllerToTest', function (toTestStar, $state, AppLearnBridge) {
        return toTest;

        function toTest(){
            var vm = this;
            _.assign(vm,{
                toggleToWordCart: toggleToWordCart,
                goToTest: goToTest,
            })
            toTestStar.call(vm);

            function toggleToWordCart(word,$event) {
                //if (Word.wordCart.indexOf(word._id)==-1){
                if (vm.wordCart.indexOf(word)==-1){
                    //$scope.toTestWords.push(wordId);
                    //Word.wordCart.push(word._id);
                    vm.wordCart.push(word);
                    word.selectedToCart=true;

                }else{
                    //$scope.toTestWords.splice($scope.toTestWords.indexOf(wordId), 1);
                    //Word.wordCart.splice(Word.wordCart.indexOf(word._id), 1);
                    vm.wordCart.splice(vm.wordCart.indexOf(word), 1);
                    word.selectedToCart=false;
                }
                //this.toTestWords = this.Word.wordCart;
            }
            function goToTest(){
                if (vm.wordCart.length>0){
                    AppLearnBridge.sharedTerms = vm.wordCart;
                    $state.go('learn');
                }else{
                    alert('You must select more than 1 term to learn!')
                }


            }
        }
    });

/**
 * Created by chuso_000 on 16/8/2015.
 */
//module.exports = toTestStar;
angular.module('controllers')
    .factory('toTestStar', function () {
        return toTestStar;

        function toTestStar(){
            var vm = this;
            _.assign(vm,{
                starAll: starAll,
                unstarAll: unstarAll,
                starUnder6: starUnder6,
                starCurrentPage: starCurrentPage,
            })


            function starAll(){
                vm.wordCart=[];
                vm.currentWordlist.forEach(function(word){
                    //Word.wordCart.push(word._id);
                    vm.wordCart.push(word);
                });
                vm.currentWordlist.map(function(item){
                    item.selectedToCart = true;
                    return item;
                });
                //this.wordCart = this.Word.wordCart;
            }
            function unstarAll(){
                vm.wordCart=[];
                //this.wordCart = this.Word.wordCart;
                vm.currentWordlist.map(function(item){
                    item.selectedToCart = false;
                    return item;
                });
            }
            function starUnder6(){
                vm.wordCart=[];
                vm.currentWordlist.map(function(item){
                    if ((item.NoCorrectAns - item.NoWrongAns) < 6)
                    {
                        item.selectedToCart = true;
                        vm.wordCart.push(item);
                    }
                    else item.selectedToCart = false;
                    return item;
                });
                //this.wordCart = this.Word.wordCart;
            }
            function starCurrentPage(){
                vm.currentWordlist = vm.currentWordlist.map(function(item, index){
                    if (index>= (vm.openingPage - 1)*7 && index<vm.openingPage*7){
                        if (!item.selectedToCart)
                            vm.wordCart.push(item);
                        item.selectedToCart = true;
                    }
                    return item;
                });
                //this.wordCart = this.Word.wordCart;
            }
        }
    });

/**
 * Created by chuso_000 on 16/8/2015.
 */
//module.exports = wordAddNewForm;
angular.module('controllers')
    .factory('wordAddNewForm', function ($http, helper) {
        return wordAddNewForm;

        function wordAddNewForm(){
            var vm = this;
            _.assign(vm,{
                resetForm: resetForm,
                getSuggestedImages: getSuggestedImages,
                selectSuggestedImage: selectSuggestedImage,
                removeNewImage: removeNewImage,
                toggleAddNewBar: toggleAddNewBar,
            })
            function resetForm(){
                vm.newword = '';
                vm.newmeaning='';
                vm.newexample='';
                vm.newimage='';
                vm.suggestedImages=[];
            }
            function getSuggestedImages(text){
                vm.loading.imageSuggestion = true;
                vm.newimage='';
                helper.getSuggestedImages(text).then(function(res){
                    vm.suggestedImages=res;
                    vm.loading.imageSuggestion = false;
                });
            }
            function selectSuggestedImage(image){
                vm.newimage = image;
            }
            function removeNewImage(){
                vm.newimage='';
            }
            function toggleAddNewBar(){
                $('.addnewDiv').stop().toggle('slow', function(){
                    $(window).resize();
                });
                $('.addnewToggleBar i').toggleClass('fa-angle-down');
                $('.addnewToggleBar i').toggleClass('fa-angle-up');
            }
        }
    })

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

/**
 * Created by chuso_000 on 16/8/2015.
 */
//var wordAPI = require('./word.api');
//var wordAddNewForm = require('./word.add-new-form');
//module.exports = word;
angular.module('controllers.mainController.word',[])
    .factory('mainControllerWord', function (wordAPI, wordAddNewForm) {
        return word;

        function word(){
            var vm = this;
            wordAPI.call(vm);
            wordAddNewForm.call(vm);
        }
    })

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

/**
 * Created by chuso_000 on 16/8/2015.
 */
//var wordlistCommon = require('./wordlist.common');
//var wordlistNavigation = require('./wordlist.navigation');
//var wordlistTermDisplay = require('./wordlist.term-display');
angular.module('controllers.mainController.wordlist',[])
    .factory('mainControllerWordlist', function (wordlistCommon, wordlistNavigation, wordlistTermDisplay) {
        return wordlist;

        function wordlist(){
            var vm = this;


            wordlistCommon.call(vm);
            wordlistNavigation.call(vm);
            wordlistTermDisplay.call(vm);

        }
    })
//module.exports = wordlist;

/**
 * Created by chuso_000 on 16/8/2015.
 */
//module.exports = wordlistNavigation;
angular.module('controllers')
    .factory('wordlistNavigation', function ($location, $anchorScroll) {
        return wordlistNavigation;

        function wordlistNavigation(){
            var vm = this;
            _.assign(vm,{
                goToFirstPage: goToFirstPage,
                goToLastPage: goToLastPage,
                nextPage: nextPage,
                previousPage: previousPage,
            })

            function goToFirstPage(){
                vm.refreshPage(1);
                $location.hash('twl');
                $anchorScroll();
            }
            function goToLastPage(){
                vm.refreshPage(vm.totalPages);
                $location.hash('twl');
                $anchorScroll();
            }
            function nextPage(){
                vm.openingPage++;
                vm.$data = (vm.currentWordlist).slice((vm.openingPage - 1) * 7, vm.openingPage * 7);
                $location.hash('twl');
                $anchorScroll();
            }
            function previousPage(){
                vm.openingPage--;
                vm.$data = (vm.currentWordlist).slice((vm.openingPage - 1) * 7, vm.openingPage * 7);
                $location.hash('twl');
                $anchorScroll();
            }
        }
    })

/**
 * Created by chuso_000 on 16/8/2015.
 */
//module.exports = wordlistTermDisplay;
angular.module('controllers')
    .factory('wordlistTermDisplay', function ($q, $timeout, Word, helper) {
        return wordlistTermDisplay;

        function wordlistTermDisplay(){
            var vm = this;
            _.assign(vm,{
                getWords: getWords,
                wordLoaded: wordLoaded,
                expandExample: expandExample,
                hideToggleExampleBool: hideToggleExampleBool,
            })

            function getWords(folderId){
                //console.log('Loading words in folder');
                vm.currentOpeningFolder=folderId;
                //$('img.loading').show(300);
                $('.viewA').animate({
                    opacity:0.3
                },1000);
                var defer = $q.defer();

                defer.promise.then(function (data){
                    if (data) vm.openingPage= 1;
                    //$('img.loading').hide(300);
                    $('.viewA').stop().animate({
                        opacity:1
                    },1000);
                    data.map(function(item){
                        var i = item;
                        item.editing=false;
                        item.selectedToCart=false;
                        return item;
                    });
                    //console.log(data);
                    vm.currentWordlist= helper.orderByScoreFilter(data);
                    vm.toTestWords = [];

                    vm.refreshPage();
                    $timeout(function () {
                        $(window).resize();
                    },0);

                });
                Word.getWords(folderId).then(function(data){
                    defer.resolve(data);
                });
            }
            function wordLoaded(){
                return !!vm.currentWordlist;
            }
            function expandExample(e){
                //console.log('expanding...', e.target);
                //console.log('status: ',$(e.target).parents('.row').children('.exampleDiv').css('overflow-y'));
                var parent=$(e.target).parents('.row');
                var exampleDiv = $(e.target).parents('.row').children('.exampleDiv');
                //console.log(parseInt($(e.target).parents('.row').children('.exampleDiv').css('max-height')));
                if (parseInt($(e.target).parents('.row').children('.exampleDiv').css('max-height'))>160){
                    //console.log('Narrow');
                    if (exampleDiv.height()>160){
                        exampleDiv
                            .css('overflow-y','hidden')
                            .stop()
                            .animate({
                                'max-height':'160px'
                            },300);
                    }else{
                        //console.log('this run only when height <= 160px');
                        exampleDiv
                            .css('overflow-y','hidden')
                            .css('max-height','160px')
                    }
                    //$(e.target).text('More');
                    $(e.target).css('transform','');
                }else{
                    //console.log('Expand');
                    $(e.target).parents('.row').children('.exampleDiv')
                        .stop()
                        .css('overflow-y','auto')
                        .animate({
                            'max-height':'800px'
                        },'slow','linear',function(){
                            exampleDiv.css('max-height',exampleDiv.height()+30);
                        })

                    //$(e.target).text('Less');
                    $(e.target).css('transform','rotate(180deg)');
                    //.css('max-height','2000px')
                    //.css('overflow-y','visible');
                }
            }
            function hideToggleExampleBool(index){

                var toggleBar = $($('.toggleExampleBar')[index]);
                var exampleDiv =toggleBar.prev();

                var exampleInnerHeight = exampleDiv.height();
                var examplePaddingTop = parseInt(exampleDiv.css('padding-top'));
                var examplePaddingBottom= parseInt(exampleDiv.css('padding-bottom'));
                var exampleHeight = exampleInnerHeight + examplePaddingBottom +examplePaddingTop;
                //console.log('*************Hide Toggle Example Bool*************');
                //console.log('toggleBar: ', toggleBar);
                //console.log('exampleDiv: ', exampleDiv);
                //console.log('exampleHeight of child('+index+'): ', exampleHeight);
                if (exampleHeight<160)
                {
                    //console.log(false);
                    return false;
                }
                //console.log(true);
                return true;
            }
        }
    })
