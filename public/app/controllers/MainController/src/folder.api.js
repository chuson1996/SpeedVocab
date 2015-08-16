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
