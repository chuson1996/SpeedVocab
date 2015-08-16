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
