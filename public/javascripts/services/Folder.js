/**
 * Created by chuso_000 on 6/5/2015.
 */
//(function(){
    var app= angular.module('services',[]);
    app.service('Folder', ['$http',function($http){
        var self=this;
        self.getFolders=function(){
            return $http.get('/speedvocab/api/getfolders').then(function (res) {
                console.log('Getting folders...');
                self.folders = res.data.sort(function(a,b){
                    return new Date(a.createdAt) < new Date(b.createdAt);
                });
                return self.folders;
            });
        };
        self.getFolderById = function(folderId){
            return $http.get('/speedvocab/api/getfolderById/'+folderId).then(function(res){
                return res.data;
            })
        };
        self.addFolder=function(newname, newfromLang, newtoLang){
            $.post('/speedvocab/post/addfolder',{
                folderName: newname,
                fromLang: newfromLang,
                toLang: newtoLang
            }, function(res){
                console.log(res);
            });
        }
    }])
//}());