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
