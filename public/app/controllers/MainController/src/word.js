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
