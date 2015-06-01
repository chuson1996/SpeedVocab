/**
 * Created by chuso_000 on 6/5/2015.
 */
//(function(){
    function onError(err){
        console.log(err);
        return new Promise(function(resolve, reject){
            reject('Error');
        });
    }
    var app= angular.module('services');
    app.service('Word', function($http){
        var self=this;
        self.wordCart=[];
        self.getWords=function(folderId){
            return $http.get('/speedvocab/api/getwords?openningFolder='+folderId).then(function(res){
                self.words = res.data;
                self.wordCart=[];
                self.wordCart.splice(0, self.wordCart.length);
                return self.words;


            });
        };
        self.addWord=function(folderId, newword, newmeaning, newexample, newimage){
            return $.post('/speedvocab/post/addword',{
                folderId: folderId,
                addword: newword,
                addmeaning: newmeaning,
                addexample: newexample,
                addimage: newimage
            }).then(function(res){
                return res;
            })
        };

        self.addToCart=function(wordId){
            if (wordCart.indexOf(wordId)==-1){
                wordCart.push(wordId);
                return true;
            }else{
                wordCart.splice(wordCart.indexOf(wordId), 1);
                return false;
            }
        };

        self.editWord=function(wordid,folderId, newword, newmeaning, newexample, newimage){
            return $http.put('/speedvocab/api/editword/'+wordid, {
                folderId: folderId,
                editword: newword,
                editmeaning: newmeaning,
                editexample: newexample,
                editimage: newimage
            }).then(function(res){
                return res;
            });
        };

        self.deleteWord=function(wordid){
            return $http.delete('/speedvocab/api/deleteword/'+wordid).then(function(res){
                return res;
            });
        };

        self.updateNoCorrectAns=function(wordid){
            return $http.put('/speedvocab/api/updateNoCorrectAns/'+wordid,{}).then(function(res){
                return res.data;
            });
        };
        self.updateNoWrongAns=function(wordid){
            return $http.put('/speedvocab/api/updateNoWrongAns/'+wordid,{}).then(function(res){
                return res.data;
            });
        };
        self.defineWord=function(word){
            if (word==='' || word===undefined) return new Promise(function(resolve, reject){
                reject('Word is undefined');
            });
            return $http.get('/speedvocab/api/defineWord/'+word).then(function(res){
                // Error Handling................
                console.log(res);
                // ------------------------------
                var data = res.data;
                var toSend ={};
                toSend.pronunctiation = data.pronunciation;
                toSend.results=[];
                data.results.forEach(function(result){
                    var item={};
                    item.definition = result.definition;
                    item.partOfSpeech = result.partOfSpeech;
                    item.synonyms = result.synonyms;
                    item.examples = result.examples;
                    toSend.results.push(item);
                });
                return toSend;
            }, onError);
        };
        self.paraphaseToExample=function(para){
            var str ='';
            para.results.forEach(function(result){
                str +='<p><b>Def: ('+result.partOfSpeech+') '+result.definition+'</b></p>';
                if(result.synonyms!==undefined) str +='<p>Syn: '+result.synonyms.join(', ')+'</p>';
                if(result.examples!==undefined) str +='<pre><i>'+result.examples.join('.<br>')+'</i></pre>';
            });

            return str;
        };
    });

//}());