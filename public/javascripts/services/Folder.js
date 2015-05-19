/**
 * Created by chuso_000 on 6/5/2015.
 */
//(function(){
    var app= angular.module('SpeedVocab');
    app.service('Folder', ['$http',function($http){
        var self=this;
        self.getFolders=function(){
            return $http.get('/speedvocab/api/getfolders').then(function (res) {
                //console.log(folders.data);
                self.folders = res.data;
                return res.data;
            });
        }
        self.addFolder=function(){
            var newname=prompt('Name of the folder: ');
            var newfromLang=prompt('fromLang: ');
            var newtoLang=prompt('toLang: ');
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