/**
 * Created by chuso_000 on 8/5/2015.
 */
(function(){
    var app = angular.module('services');
    app.service('LearnRound',['$http','AppLearnBridge','voiceList','ArrRandNum',function($http,AppLearnBridge,voiceList,ArrRandNum){
        var self = this;
        self.rounds=[];
        //console.log(AppLearnBridge.sharedTerms);
        if (!AppLearnBridge.sharedTerms.length) return window.location.href='/speedvocab';

        self.initialize=function(){
            //self.toLearnWords = toLearnWords;
            //console.log(AppLearnBridge.sharedTerms[0]._id);
            return $http.get('/speedvocab/api/word/'+AppLearnBridge.sharedTerms[0]._id).then(function(res){
                //console.log(res.data);
                var folderInfo = res.data.folder;

                self.toLearnWords=AppLearnBridge.sharedTerms.map(function(o){
                    o.wordVoice="http://vaas.acapela-group.com/Services/Streamer.ogg?req_voice="+voiceList[folderInfo.fromLang]+"&req_text="+ o.word.replace(/ /g, '+')+"&cl_login=EVAL_VAAS&cl_app=EVAL_1187628&cl_pwd=2anoa8wk";
                    o.meaningVoice="http://vaas.acapela-group.com/Services/Streamer.ogg?req_voice="+voiceList[folderInfo.toLang]+"&req_text="+o.meaning.replace(/ /g, '+')+"&cl_login=EVAL_VAAS&cl_app=EVAL_1187628&cl_pwd=2anoa8wk";
                    return o;
                });


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
            });

        };
        self.divideToRounds = function(){
            //self.wordlist
            var toLearnWords = self.toLearnWords;
            self.rounds = _.chunk(toLearnWords,10);
            self.rounds = _.map(self.rounds, function(o){
                return ArrRandNum(o);
            });
            //console.log(self.rounds);

        }
    }]);
}());