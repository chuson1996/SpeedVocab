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
