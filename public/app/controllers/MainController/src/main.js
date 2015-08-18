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

    vm.currentOpeningFolder = null;

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
            vm.currentOpeningFolder = null;
            Folder.getFolders().then(function (data){
                vm.folders = data;
                //console.log(data);
            });
        }
    }


}
