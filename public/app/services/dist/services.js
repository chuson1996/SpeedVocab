(function(){
    angular.module('services')
        .service('AppLearnBridge', function(){
            this.sharedTerms=[];
        })
})();

/**
 * Created by chuso_000 on 6/5/2015.
 */
(function(){
    angular.module('services')
        .service('Folder', ['$http',function($http){

            var self=this;

            self.getFolders=getFolders;
            self.getFolderById = getFolderById;
            self.addFolder=addFolder;
            self.deleteFolder = deleteFolder;
            var lang = 'english finnish russian vietnamese chinese'.split(' ');
            var code = 'en fi ru vi zh'.split(' ');
            self.decodeLang = decodeLang;
            self.encodeLang = encodeLang;
            self.editFolder = editFolder;

            /////

            function getFolders(){
                return $http.get('/speedvocab/api/getfolders').then(function (res) {
                    //console.log('Getting folders...');
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
                    return langCode;
                }
            }
            function encodeLang(langF){
                if (_.indexOf(lang, langF)!==-1){
                    // lang --> code
                    return code[_.indexOf(lang, langF)];
                }else{
                    return langF;
                }
            }
            function editFolder(folder){
                console.log('folder to edit: ', folder);
                return $http.put('/speedvocab/api/editfolder',folder).then(function(res){
                    //console.log(res);
                    return res;
                }).catch(console.error);
            }
    }])
})();
/**
 * Created by chuso_000 on 8/5/2015.
 */
(function(){
    var app = angular.module('services');
    app.service('LearnRound',['$http','AppLearnBridge','voiceList',function($http,AppLearnBridge,voiceList){
        var self = this;
        self.rounds=[];
        //console.log(AppLearnBridge.sharedTerms);
        if (!AppLearnBridge.sharedTerms.length) return window.location.href='/speedvocab';

        self.initialize=function(){
            //self.toLearnWords = toLearnWords;
            //console.log(AppLearnBridge.sharedTerms);
            //return $http.get('/speedvocab/api/word/'+AppLearnBridge.sharedTerms[0]._id).then(function(res){
                //console.log(res.data);

                self.toLearnWords=AppLearnBridge.sharedTerms;
                //var folderInfo = res.data.folder;
                //self.toLearnWords=AppLearnBridge.sharedTerms.map(function(o){
                //    o.wordVoice="http://vaas.acapela-group.com/Services/Streamer.ogg?req_voice="+voiceList[folderInfo.fromLang]+"&req_text="+ o.word.replace(/ /g, '+')+"&cl_login=EVAL_VAAS&cl_app=EVAL_1187628&cl_pwd=2anoa8wk";
                //    o.meaningVoice="http://vaas.acapela-group.com/Services/Streamer.ogg?req_voice="+voiceList[folderInfo.toLang]+"&req_text="+o.meaning.replace(/ /g, '+')+"&cl_login=EVAL_VAAS&cl_app=EVAL_1187628&cl_pwd=2anoa8wk";
                //    return o;
                //});


                self.toLearnWords.map(function(o){
                    var i=o;
                    i.status=false;
                    return i;
                });
                self.toLearnWords.sort(function(a,b){
                    return ((a.NoCorrectAns- a.NoWrongAns) >(b.NoCorrectAns- b.NoWrongAns) ? 1: -1);
                });
                //console.log('self.toLearnWords: ',self.toLearnWords);
                self.total=self.toLearnWords.length;
                //console.log('total: ',self.total);
                self.divideToRounds();
                return new Promise(function(resolve, reject){resolve('Doesnt matter');});
            //});

        };
        self.divideToRounds = function(){
            //self.wordlist
            var toLearnWords = self.toLearnWords;
            self.rounds = _.chunk(toLearnWords,10);
            self.rounds = _.map(self.rounds, function(o){
                return _.shuffle(o);
            });
            //console.log(self.rounds);

        }
    }]);
}());
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
/**
 * Created by chuso_000 on 13/8/2015.
 */
(function (app) {
    app.factory('beforeMethod',function(){
        return function (object, props, beforeMethod) {
            props.forEach(function (prop) {
                if (typeof object[prop] !== 'function')
                    console.error(prop + ' not a function error!');
                else{
                    var ori = object[prop];
                    object[prop] = function(){
                        beforeMethod();
                        return ori.apply(object, arguments);

                    }
                }
            })
        }
    })
})(angular.module('services'));


(function () {
    angular.module('services').factory('helper', function ($http) {
        var o = {};
        _.assign(o, {
            getSuggestedImages: getSuggestedImages,
            orderByScoreFilter: orderByScoreFilter,
            orderByDate: orderByDate,
            formatDate: formatDate
        });
        return o;
        function getSuggestedImages(text) {
            console.log('get suggested images');
            return $http.get('/speedvocab/api/getSuggestedImages/' + encodeURIComponent(text)).then(function (res) {
                //console.log(res.data);
                //$scope.suggestedImages= res.data;
                return res.data;
            });
        }
        function orderByScoreFilter(items) {
            var filtered = [];
            if (items === undefined)
                return items;
            items.forEach(function (item) {
                filtered.push(item);
            });
            filtered.sort(function (a, b) {
                if ((a.NoCorrectAns - a.NoWrongAns) == (b.NoCorrectAns - b.NoWrongAns)) {
                    return (new Date(a.createdAt) < new Date(b.createdAt)) ? 1 : -1;
                }
                return ((a.NoCorrectAns - a.NoWrongAns) > (b.NoCorrectAns - b.NoWrongAns) ? 1 : -1);
            });
            return filtered;
        }
        function orderByDate(items) {
            var filtered = [];
            if (items === undefined)
                return items;
            items.forEach(function (item) {
                filtered.push(item);
            });
            filtered.sort(function (a, b) {
                return (new Date(a.createdAt) < new Date(b.createdAt)) ? 1 : -1;
            });
            return filtered;
        }
        function formatDate(createdAt) {
            if (!createdAt)
                return Date();
            var date = new Date(createdAt).getDate();
            var month = new Date(createdAt).getMonth() + 1;
            var year = new Date(createdAt).getFullYear();
            //console.log(new Date(createdAt).getDate());
            //console.log(new Date(createdAt).getMonth()+1);
            //console.log(new Date(createdAt).getFullYear());
            var str = '';
            var monthList = 'Jan Feb Mar April May Jun Jul Aug Sep Oct Nov Dec'.split(' ');
            str += date + ' ' + monthList[month - 1];
            if (year !== new Date().getFullYear())
                str += ' ' + year;
            return str;
        }
    });
})();
//# sourceMappingURL=helper.js.map
(function(app){
    app.factory('voiceList', function(){
        return {
            fi: 'sanna22k',
            en: 'sharon22k',
            ru: 'alyona22k'
        };
    })
}(angular.module('services')));
/**
 * Created by chuso_000 on 13/7/2015.
 */
(function () {
    angular.module('services').factory('yandexSupportedLangs', function(){
        var supportedLangs = ["ru-ru","ru-en","ru-pl","ru-uk","ru-de","ru-fr","ru-es","ru-it","ru-tr","en-ru","en-en","en-de","en-fr","en-es","en-it","en-tr","pl-ru","uk-ru","de-ru","de-en","fr-ru","fr-en","es-ru","es-en","it-ru","it-en","tr-ru","tr-en"];
        sl.indexOf = function(from,to){
            return supportedLangs.indexOf(from+"-"+to)>=0?true:false;
        }
        function sl(){
            return supportedLangs;
        }
        return sl;

    });
})();
