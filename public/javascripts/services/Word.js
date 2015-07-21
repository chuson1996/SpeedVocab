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
    app.service('Word', function($http, yandexSupportedLangs){
        var self=this;
        self.wordCart=[];
        self.words=[];
        self.getWords=getWords;
        self.addWord=addWord;
        self.addToCart=addToCart;
        self.editWord=editWord;
        self.deleteWord=deleteWord;
        self.updateNoCorrectAns=updateNoCorrectAns;
        self.updateNoWrongAns=updateNoWrongAns;
        self.defineWord=defineWord ;
        self.paraphaseToExampleElse =paraphaseToExampleElse;
        self.paraphaseToExampleEN2EN=paraphaseToExampleEN2EN;
        self.loadingDefinition=false;

        ///////

        function getWords(folderId){
            return $http.get('/speedvocab/api/getwords/'+folderId).then(function(res){
                self.words = res.data;
                //console.log(res.data);
                self.wordCart=[];
                self.wordCart.splice(0, self.wordCart.length);
                //self.words.map(function(term){
                //    try{
                //        //var audio1 = document.createElement('audio');
                //        //audio1.src=term.wordVoice;
                //        //term.wordAudio = audio1;
                //        term.wordAudio=new Audio(term.wordVoice);
                //        //var audio2 = document.createElement('audio');
                //        //audio2.src=term.meaningVoice;
                //        //term.meaningAudio = audio2;
                //        term.meaningAudio=new Audio(term.meaningVoice);
                //
                //
                //        return term;
                //    }catch(e){
                //
                //    }
                //
                //
                //
                //
                //});
                return self.words;


            });
        }
        function addWord(folderId, newword, newmeaning, newexample, newimage){
            return $http.post('/speedvocab/post/addword',{
                folderId: folderId,
                addword: newword,
                addmeaning: newmeaning,
                addexample: newexample,
                addimage: newimage
            }).then(function(res){
                return res.data;
            })
        }
        function addToCart(wordId){
            if (wordCart.indexOf(wordId)==-1){
                wordCart.push(wordId);
                return true;
            }else{
                wordCart.splice(wordCart.indexOf(wordId), 1);
                return false;
            }
        }
        function editWord(wordid,folderId, newword, newmeaning, newexample, newimage){
            return $http.put('/speedvocab/api/editword/'+wordid, {
                folderId: folderId,
                editword: newword,
                editmeaning: newmeaning,
                editexample: newexample,
                editimage: newimage
            }).then(function(res){
                return res;
            });
        }
        function deleteWord(wordid){
            return $http.delete('/speedvocab/api/deleteword/'+wordid).then(function(res){
                return res;
            });
        }
        function updateNoCorrectAns(wordid){
            return $http.put('/speedvocab/api/updateNoCorrectAns/'+wordid,{}).then(function(res){
                return res.data;
            });
        }
        function updateNoWrongAns(wordid){
            return $http.put('/speedvocab/api/updateNoWrongAns/'+wordid,{}).then(function(res){
                return res.data;
            });
        }
        function defineWord(word, from, to){
            if (word==='' || word===undefined) return new Promise(function(resolve, reject){
                reject('Word is undefined');
            });
            return $http.get('/speedvocab/api/defineWord/'+word+'/'+from+'/'+to).then(function(res){
                if (from=='en' && to=='en'){
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
                    return self.paraphaseToExampleEN2EN(toSend);
                }else if (yandexSupportedLangs.indexOf(from, to)){
                    // Error Handling................
                    //console.log(res);

                    return self.paraphaseToExampleElse(res.data);
                }else{
                    console.log(res.data);
                    return res.data.translations[0].translatedText;
                }
            }, function(err){
                alert(JSON.parse(err.data.error).message);
            });

        }
        function paraphaseToExampleElse(para) {
            var str = _.reduce(para,function(pre, cur, index, arr){
                return pre+'<p>('+index+') '+cur.join(', ')+'</p>';
            },'');
            //console.log(str);
            return str;
        }
        function paraphaseToExampleEN2EN(para){
            var str ='';
            para.results.forEach(function(result){
                str +='<p><b>Def: ('+result.partOfSpeech+') '+result.definition+'</b></p>';
                if(result.synonyms!==undefined) str +='<p>Syn: '+result.synonyms.join(', ')+'</p>';
                if(result.examples!==undefined) str +='<pre><i>'+result.examples.join('.<br>')+'</i></pre>';
            });

            return str;
        }

    });

//}());