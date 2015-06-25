/**
 * Created by chuso_000 on 24/6/2015.
 */
declare var angular;
declare var _;
declare var $;
class LearnController{
    //function($scope, $http, LearnRound, Word, orderByScoreService, $state, $timeout){
    $inject=['$scope','$http','LearnRound','Word','orderByScoreService','$state','$timeout'];
    remaining=0;
    incorrect=0;
    correct=0;
    rounds=[];
    ongoingRoundNo=0;
    ongoingWordNo=0;
    questionT='';
    questionVoiceT='';
    reverse=false;
    missedTerms=[];
    correctTerms=[];
    speakText=true;
    result;
    currentWordlist;
    finished=false;
    answer = '';
    onAnswering=true;
    constructor($scope, public $http, public LearnRound, public Word, public orderByScoreService, public $state, public $timeout){
        LearnRound.initialize().then((da)=>{
            this.rounds=LearnRound.rounds;
            //console.log($scope.rounds);
            this.questionT=this.question(this.rounds[this.ongoingRoundNo][this.ongoingWordNo]);
            this.questionVoiceT=this.questionVoice(this.rounds[this.ongoingRoundNo][this.ongoingWordNo]);
            this.remaining=LearnRound.total;
            //$scope.remaining=$scope.rounds[$scope.ongoingRoundNo].length;
            this.rounds.map(function(round){
                round.map(function(term){
                    try{
                        var audio1 = document.createElement('audio');
                        audio1.src=term.wordVoice;
                        term.wordAudio=audio1;
                        var audio2 = document.createElement('audio');
                        audio2.src=term.meaningVoice;
                        term.meaningAudio=audio2;
                    }catch(e){

                    }

                    return term;
                });
                return round;
            });
            this.playAudio();

            $scope.ctrl = this;
        });
    }
    playAudio(){
        //var audio = document.createElement('audio');
        //audio.src=$scope.questionVoiceT;
        //if (!$scope.finished) audio.play();
        if (!this.finished){
            if (!this.reverse) this.rounds[this.ongoingRoundNo][this.ongoingWordNo].wordAudio.play();
            if (this.reverse) this.rounds[this.ongoingRoundNo][this.ongoingWordNo].meaningAudio.play();
        }

    }
    submit(){
        this.check(this.rounds[this.ongoingRoundNo][this.ongoingWordNo],this.answer, this.reverse);
        //next();
        //refresh();
        this.onAnswering = false;
        this.answer='';
        //$('#moveOn-btn').focus();
        this.$timeout(function(){
            $('#moveOnField').focus();
        }, 100)


    }
    moveOnTextfield(e,sthelse){
        //e.preventDefault();
        console.log(e);
        if (e.keyCode == 13){
            this.moveOn();
        }
    }
    moveOn(){
        this.next();
        this.refresh();
        this.onAnswering = true;
        this.$timeout(function(){
            $('input.answer').focus();
        },100);
    }
    check(term, answer, reverse){
        var final=false;
        //console.log('term: ',term);
        //console.log('answer: ', answer);
        if (reverse==true){
            if (this.containInWord(answer,term.word)){
                //if (answer==term.word){
                // TRUE
                final=true;
            }else{
                // FALSE
                final=false;
            }
        }
        if (reverse==false){
            if (this.containInWord(answer,term.meaning)){
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
            this.rounds[this.ongoingRoundNo][this.ongoingWordNo].status=true;
            this.showResult(this.rounds[this.ongoingRoundNo][this.ongoingWordNo],answer, true);
            var local_ongoingRoundNo = this.ongoingRoundNo,
                local_ongoingWordNo = this.ongoingWordNo;
            this.Word.updateNoCorrectAns(term._id).then((res)=>{
                //console.log(res);
                this.rounds[local_ongoingRoundNo][local_ongoingWordNo].NoCorrectAns = res.NoCorrectAns;
                this.rounds[local_ongoingRoundNo][local_ongoingWordNo].NoWrongAns = res.NoWrongAns;
            });
            // Animation
            $('.resultDiv').removeClass('pulse');
            $('.resultDiv').removeClass('shake');
            $('.resultDiv').removeClass('animated');
            //setTimeout(function(){$('.resultDiv').addClass('animated pulse');},100);
            // ---------
            this.correct++;
        }else{
            this.showResult(this.rounds[this.ongoingRoundNo][this.ongoingWordNo],answer, false);
            this.addToMissed(this.rounds[this.ongoingRoundNo][this.ongoingWordNo],answer);
            var local_ongoingRoundNo = this.ongoingRoundNo,
                local_ongoingWordNo = this.ongoingWordNo;
            this.Word.updateNoWrongAns(term._id).then((res)=>{
                //console.log(res);
                this.rounds[local_ongoingRoundNo][local_ongoingWordNo].NoCorrectAns = res.NoCorrectAns;
                this.rounds[local_ongoingRoundNo][local_ongoingWordNo].NoWrongAns = res.NoWrongAns;
            });
            // Animation
            $('.resultDiv').removeClass('animated');
            $('.resultDiv').removeClass('shake');
            $('.resultDiv').removeClass('pulse');
            setTimeout(function(){$('.resultDiv').addClass('animated shake');},100);
            // ---------
            this.incorrect++;
        }

        //next();
        //refresh();
    }
    next(){
        if (this.ongoingWordNo!==this.rounds[this.ongoingRoundNo].length-1){
            // HAVEN'T REACHED THE END OF THE CURRENT ROUND
            //do{
            this.ongoingWordNo++;
            //console.log($scope.ongoingWordNo);
            if (this.rounds[this.ongoingRoundNo][this.ongoingWordNo].status==true) this.next();
            //if ($scope.ongoingWordNo>=$scope.rounds[$scope.ongoingRoundNo].length) break;
            //}while($scope.rounds[$scope.ongoingRoundNo][$scope.ongoingWordNo].status==true && $scope.ongoingWordNo<$scope.rounds[$scope.ongoingRoundNo].length );
        }else{
            // HAVE REACHED THE END OF THE THE CURRENT ROUND
            //alert('End of this round');
            //console.log(allCorrect());
            if (!this.allCorrect()) {
                this.ongoingWordNo=0;
                //while($scope.rounds[$scope.ongoingRoundNo][$scope.ongoingWordNo].status==true && $scope.ongoingWordNo<$scope.rounds[$scope.ongoingRoundNo].length){
                //    $scope.ongoingWordNo++;
                //}
                if (this.rounds[this.ongoingRoundNo][this.ongoingWordNo].status==true) this.next();
                //console.log('$scope.rounds['+$scope.ongoingRoundNo+']['+$scope.ongoingWordNo+']',$scope.rounds[$scope.ongoingRoundNo][$scope.ongoingWordNo]);
            }
            else{
                if (this.ongoingRoundNo!==this.rounds.length-1){
                    // THIS IS NOT THE LAST ROUND. MOVE ON TO THE NEXT ROUND
                    this.ongoingWordNo=0;
                    this.ongoingRoundNo++;
                }else{
                    // THIS IS THE LAST ROUND

                    this.finished=true;
                    //alert('The end!');
                }
            }

        }
    }
    //reset(){
    //    this.reset();
    //}
    reverseCheck(){
        //console.log($scope.reverse);
        this.next();
        this.refresh();
    }
    back(){
        this.$state.transitionTo('index',{fid:this.rounds[0][0].folderId})
    }
    allCorrect(){
        return this.rounds[this.ongoingRoundNo].every(function(elem, index, array){
            return elem.status;
        });
    }
    refresh(){
        this.questionT=this.question(this.rounds[this.ongoingRoundNo][this.ongoingWordNo], this.reverse);
        this.questionVoiceT=this.questionVoice(this.rounds[this.ongoingRoundNo][this.ongoingWordNo], this.reverse);
        this.remaining=function(){
            return _.flatten(this.rounds, true).reduce(function(final, cur, index, arr){
                if (cur.status==false) return final+1;
                return final;
            },0);

        }();
        if (this.speakText) this.playAudio();
    }
    reset(){
        this.incorrect=0;
        this.correct=0;
        this.ongoingRoundNo=0;
        this.ongoingWordNo=0;
        this.questionT='';
        this.questionVoiceT='';
        this.missedTerms=[];
        this.correctTerms=[];
        this.finished=false;
        this.rounds.map((round)=>{
            round.map(function(term){
                term.status=false;
                term.answer=[];
                term.answer.splice(0,term.answer.length);
                return term;
            });
            return round;
        });
        this.currentWordlist = this.orderByScoreService(this.currentWordlist);
        this.refresh();
    }
    question(term, reverse?){
        if (reverse) return term.meaning;
        return term.word;
    }
    questionVoice(term, reverse?){
        if (reverse) return term.meaningVoice;
        return term.wordVoice;
    }
    showResult(term, answer, correct){
        this.result={
            word: term.word,
            meaning: term.meaning,
            example: term.example,
            image: term.image,
            correct:correct,
            answer: answer
        };
        //console.log($scope.result);
    }
    addToMissed(term, answer){
        var i=term;
        if (i.answer==undefined)
            i.answer=[];
        i.answer.push(answer);
        if (this.missedTerms.indexOf(term)==-1)
            this.missedTerms.push(i);
    }
    addToCorrect(term){
        this.correctTerms.push(term);
    }

    containInWord(ans,wrd){
        //console.log('ans: ', ans);
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
}
angular.module('controllers',['services','textAngular','customFilter','ui.router']).controller('LearnController', LearnController)