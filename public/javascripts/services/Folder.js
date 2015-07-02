/**
 * Created by chuso_000 on 6/5/2015.
 */
//(function(){
    var app= angular.module('services',[]);
    app.service('Folder', ['$http',function($http){
        var self=this;

        self.getFolders=getFolders;
        self.getFolderById = getFolderById;
        self.addFolder=addFolder;
        self.deleteFolder = deleteFolder;
        var lang = 'english finnish russian vietnamese'.split(' ');
        var code = 'en fi ru vi'.split(' ');
        self.decodeLang = decodeLang;
        self.encodeLang = encodeLang;
        self.editFolder = editFolder;

        /////

        function getFolders(){
            return $http.get('/speedvocab/api/getfolders').then(function (res) {
                console.log('Getting folders...');
                self.folders = res.data.sort(function(a,b){
                    return new Date(a.createdAt) < new Date(b.createdAt);
                });
                self.folders = _.map(self.folders, function(o){
                    o.editing = false;
                    return o;
                })
                return self.folders;
            });
        }
        function getFolderById(folderId){
            return $http.get('/speedvocab/api/getfolderById/'+folderId).then(function(res){
                return res.data;
            })
        }
        function addFolder(newname, newfromLang, newtoLang){
            return $http.post('/speedvocab/post/addfolder',{
                folderName: newname,
                fromLang: newfromLang,
                toLang: newtoLang
            }).then(function(res){
                //console.log(res);
                return res;
            }).catch(console.error);
        }
        function deleteFolder(folderId){
            return $http.delete('/speedvocab/api/deletefolder/'+folderId).then(function(res){
                return res;
            })
        }
        function decodeLang(langCode){
            if(_.indexOf(code, langCode)!==-1){
                // code --> lang
                return _.capitalize(lang[_.indexOf(code, langCode)]);
            }else{
                return ;
            }
        }
        function encodeLang(langF){
            if (_.indexOf(lang, langF)!==-1){
                // lang --> code
                return code[_.indexOf(lang, langF)];
            }else{
                return ;
            }
        }
        function editFolder(folder){
            return $http.put('/speedvocab/api/editfolder',folder).then(function(res){
                //console.log(res);
                return res;
            }).catch(console.error);
        }
    }])
//}());