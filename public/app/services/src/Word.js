/**
 * Created by chuso_000 on 6/5/2015.
 */
(function(){
    function onError(err){
        console.log(err);
        return new Promise(function(resolve, reject){
            reject('Error');
        });
    }
    var app= angular.module('services');
    app.service('Word', function($http, $q, $cacheFactory,yandexSupportedLangs, beforeMethod){
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

        var currentFolderId = null;
        /* Every action that might alter the origin of the data will clear itself in the cache. In other word: RESET */
        beforeMethod(self,['addWord','editWord','deleteWord','updateNoWrongAns','updateNoCorrectAns'], clearCache);
        ///////
        function clearCache(){
            if ($cacheFactory.get('SpeedVocab') && $cacheFactory.get('SpeedVocab').get('/speedvocab/api/getwords/'+currentFolderId)){
                console.log('Clear cache');
                $cacheFactory.get('SpeedVocab').destroy();
            }
        }
        function getWords(folderId){
            currentFolderId = folderId;
            var defer = $q.defer();

            var cacheObj = $cacheFactory.get('SpeedVocab');
            if (cacheObj && cacheObj.get('/speedvocab/api/getwords/'+folderId))
            {
                console.log('Retrieved from cache');
                defer.resolve(cacheObj.get('/speedvocab/api/getwords/'+folderId));
                return defer.promise.then(function (data) {
                    handleData(data);
                    return data;
                });
            }

            if (!cacheObj){
                cacheObj = $cacheFactory('SpeedVocab');
            }
            return $http({
                method:'GET',
                url:'/speedvocab/api/getwords/'+folderId,
                cache: false
            }).then(function(res){
                cacheObj.put('/speedvocab/api/getwords/'+folderId, res.data);
                handleData(res.data);
                return res.data;

            });
            function handleData(data){
                self.words = data;
                //console.log(res.data);
                self.wordCart=[];
                self.wordCart.splice(0, self.wordCart.length);
            }
        }
        function addWord(folderId, newword, newmeaning, newexample, newimage){
            //clearCache('/speedvocab/api/getwords/'+folderId);
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
            //editData = {
            //  folderId: sth,
            //  editword: sth,...
            // };
            //clearCache('/speedvocab/api/getwords/'+folderId);
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
            //clearCache('/speedvocab/api/getwords/'+folderId);
            return $http.delete('/speedvocab/api/deleteword/'+wordid).then(function(res){
                return res;
            });
        }
        function updateNoCorrectAns(wordid){
            //clearCache('/speedvocab/api/getwords/'+folderId);
            return $http.put('/speedvocab/api/updateNoCorrectAns/'+wordid,{}).then(function(res){
                return res.data;
            });
        }
        function updateNoWrongAns(wordid){
            //clearCache('/speedvocab/api/getwords/'+folderId);
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

})();