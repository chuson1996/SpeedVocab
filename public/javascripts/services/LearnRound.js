/**
 * Created by chuso_000 on 8/5/2015.
 */
(function(){
    var app = angular.module('SpeedVocab');
    app.service('LearnRound', function($http){
        var self = this;
        self.rounds=[];
        self.initialize=function(){
            //self.toLearnWords = toLearnWords;
            return $http.get('/speedvocab/api/toLearnWords').then(function(res){

                self.toLearnWords=res.data;
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
                console.log('total: ',self.total);
                self.divideToRounds();
            });
        };
        self.divideToRounds = function(){
            //self.wordlist
            var toLearnWords = self.toLearnWords;
            var i =0;
            while(toLearnWords.length>0){
                self.rounds[i]=toLearnWords.slice(0,10);
                toLearnWords.splice(0,10);
                i++;
            }
            //console.log(self.rounds);

        }
    });
}());