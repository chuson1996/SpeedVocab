/**
 * Created by chuso_000 on 8/5/2015.
 */
(function(){
    var app = angular.module('SpeedVocab',['services','textAngular']);
    app.config(function($provide){
        $provide.decorator('taOptions',['$delegate', function(taOptions){
            taOptions.toolbar = [
                ['h2','p', 'pre', 'quote'],
                ['bold', 'italics', 'underline', 'strikeThrough', 'ul', 'ol'],
                ['justifyLeft', 'justifyCenter', 'justifyRight', 'indent', 'outdent'],
                ['html']

            ];
            return taOptions;
        }]);
    });
    app.controller('LearnController', function($scope, $http, LearnRound, Word){
        $scope.remaining=0;
        $scope.incorrect=0;
        $scope.correct=0;
        $scope.rounds=[];
        $scope.ongoingRoundNo=0;
        $scope.ongoingWordNo=0;
        $scope.question='';
        $scope.questionVoice='';
        $scope.reverse=false;
        $scope.missedTerms=[];
        $scope.correctTerms=[];
        $scope.speakText=true;
        $scope.finished=false;
        LearnRound.initialize().then(function(da){
            $scope.rounds=LearnRound.rounds;
            //console.log($scope.rounds);
            $scope.question=question($scope.rounds[$scope.ongoingRoundNo][$scope.ongoingWordNo]);
            $scope.questionVoice=questionVoice($scope.rounds[$scope.ongoingRoundNo][$scope.ongoingWordNo]);
            $scope.remaining=LearnRound.total;
            //$scope.remaining=$scope.rounds[$scope.ongoingRoundNo].length;
            $scope.rounds.map(function(round){
                round.map(function(term){
                    var audio1 = document.createElement('audio');
                    audio1.src=term.wordVoice;
                    term.wordAudio=audio1;
                    var audio2 = document.createElement('audio');
                    audio2.src=term.meaningVoice;
                    term.meaningAudio=audio2;
                    return term;
                });
                return round;
            })
            $scope.playAudio();

        });

        $scope.playAudio=function(){
            //var audio = document.createElement('audio');
            //audio.src=$scope.questionVoice;
            //if (!$scope.finished) audio.play();
            if (!$scope.finished){
                if (!$scope.reverse) $scope.rounds[$scope.ongoingRoundNo][$scope.ongoingWordNo].wordAudio.play();
                if ($scope.reverse) $scope.rounds[$scope.ongoingRoundNo][$scope.ongoingWordNo].meaningAudio.play();
            }

        };
        $scope.submit=function(){
            check($scope.rounds[$scope.ongoingRoundNo][$scope.ongoingWordNo],$scope.answer, $scope.reverse);
            $scope.answer='';
        };

        function check(term, answer, reverse){
            var final=false;
            //console.log('term: ',term);
            //console.log('answer: ', answer);
            if (reverse==true){
                if (containInWord(answer,term.word)){
                //if (answer==term.word){
                    // TRUE
                    final=true;
                }else{
                    // FALSE
                    final=false;
                }
            }
            if (reverse==false){
                if (containInWord(answer,term.meaning)){
                //if (answer==term.meaning){
                    // TRUE
                    final=true;
                }else{
                    // FALSE
                    final=false;
                }
            }
            // Update STATUS
            if (final==true) {
                $scope.rounds[$scope.ongoingRoundNo][$scope.ongoingWordNo].status=true;
                showResult($scope.rounds[$scope.ongoingRoundNo][$scope.ongoingWordNo],answer, true);
                //addToCorrect($scope.rounds[$scope.ongoingRoundNo][$scope.ongoingWordNo]);
                Word.updateNoCorrectAns(term._id).then(function(res){
                    //console.log(res);
                });
                $scope.correct++;
            }else{
                showResult($scope.rounds[$scope.ongoingRoundNo][$scope.ongoingWordNo],answer, false);
                addToMissed($scope.rounds[$scope.ongoingRoundNo][$scope.ongoingWordNo],answer);
                Word.updateNoWrongAns(term._id).then(function(res){
                    console.log(res);
                });
                $scope.incorrect++;
            }

            next();
            refresh();
        }
        function next(){
            if ($scope.ongoingWordNo!==$scope.rounds[$scope.ongoingRoundNo].length-1){
                // HAVEN'T REACHED THE END OF THE CURRENT ROUND
                //do{
                    $scope.ongoingWordNo++;
                    //console.log($scope.ongoingWordNo);
                    if ($scope.rounds[$scope.ongoingRoundNo][$scope.ongoingWordNo].status==true) next();
                //if ($scope.ongoingWordNo>=$scope.rounds[$scope.ongoingRoundNo].length) break;
                //}while($scope.rounds[$scope.ongoingRoundNo][$scope.ongoingWordNo].status==true && $scope.ongoingWordNo<$scope.rounds[$scope.ongoingRoundNo].length );
            }else{
                // HAVE REACHED THE END OF THE THE CURRENT ROUND
                //alert('End of this round');
                //console.log(allCorrect());
                if (!allCorrect()) {
                    $scope.ongoingWordNo=0;
                    //while($scope.rounds[$scope.ongoingRoundNo][$scope.ongoingWordNo].status==true && $scope.ongoingWordNo<$scope.rounds[$scope.ongoingRoundNo].length){
                    //    $scope.ongoingWordNo++;
                    //}
                    if ($scope.rounds[$scope.ongoingRoundNo][$scope.ongoingWordNo].status==true) next();
                    //console.log('$scope.rounds['+$scope.ongoingRoundNo+']['+$scope.ongoingWordNo+']',$scope.rounds[$scope.ongoingRoundNo][$scope.ongoingWordNo]);
                }
                else{
                    if ($scope.ongoingRoundNo!==$scope.rounds.length-1){
                        // THIS IS NOT THE LAST ROUND. MOVE ON TO THE NEXT ROUND
                        $scope.ongoingWordNo=0;
                        $scope.ongoingRoundNo++;
                    }else{
                        // THIS IS THE LAST ROUND

                        $scope.finished=true;
                        //alert('The end!');
                    }
                }

            }
        }
        $scope.reset=function(){
            reset();
        };
        $scope.reverseCheck=function(){
            console.log($scope.reverse);
            next();
            refresh();
        }
        function allCorrect(){
            return $scope.rounds[$scope.ongoingRoundNo].every(function(elem, index, array){
                return elem.status;
            });
        }
        function refresh(){
            $scope.question=question($scope.rounds[$scope.ongoingRoundNo][$scope.ongoingWordNo], $scope.reverse);
            $scope.questionVoice=questionVoice($scope.rounds[$scope.ongoingRoundNo][$scope.ongoingWordNo], $scope.reverse);
            $scope.remaining=function(){
                var i=0;
                $scope.rounds[$scope.ongoingRoundNo].forEach(function(o){
                    if (o.status==true) i++;
                });
                //console.log(i);
                return LearnRound.total-i;
            }();
            if ($scope.speakText) $scope.playAudio();
        }
        function reset(){
            $scope.incorrect=0;
            $scope.correct=0;
            $scope.ongoingRoundNo=0;
            $scope.ongoingWordNo=0;
            $scope.question='';
            $scope.questionVoice='';
            $scope.missedTerms=[];
            $scope.correctTerms=[];
            $scope.finished=false;
            $scope.rounds.map(function(round){
                round.map(function(term){
                    term.status=false;
                    term.answer=[];
                    term.answer.splice(0,term.answer.length);
                    return term;
                });
                return round;
            });
            refresh();
        }
        function question(term, reverse){
            if (reverse) return term.meaning;
            return term.word;
        }
        function questionVoice(term, reverse){
            if (reverse) return term.meaningVoice;
            return term.wordVoice;
        }
        function showResult(term, answer, correct){
            $scope.result={
                word: term.word,
                meaning: term.meaning,
                example: term.example,
                image: term.image,
                correct:correct,
                answer: answer
            };
            //console.log($scope.result);
        }
        function addToMissed(term, answer){
            var i=term;
            if (i.answer==undefined)
                i.answer=[];
            i.answer.push(answer);
            if ($scope.missedTerms.indexOf(term)==-1)
                $scope.missedTerms.push(i);
        }
        function addToCorrect(term){
            $scope.correctTerms.push(term);
        }

        function containInWord(ans,wrd){
            console.log('ans: ', ans);
            if (!ans) return false;
            var ArrWrd = wrd.split(",");
            var valid=false;
            for (var i=0; i<ArrWrd.length;i++){
                ArrWrd[i]=(ArrWrd[i].trim()).toLowerCase();

            }
            //if (Arr)
            if (ans.toLowerCase()===""||ArrWrd.indexOf(ans.toLowerCase())===-1 ){
                valid=false;
            } else valid=true;

            return valid;
        }


    });
}());