var LearnController = (function () {
    function LearnController($scope, $http, LearnRound, Word, orderByScoreService, $state, $timeout) {
        var _this = this;
        this.$http = $http;
        this.LearnRound = LearnRound;
        this.Word = Word;
        this.orderByScoreService = orderByScoreService;
        this.$state = $state;
        this.$timeout = $timeout;
        //function($scope, $http, LearnRound, Word, orderByScoreService, $state, $timeout){
        this.$inject = ['$scope', '$http', 'LearnRound', 'Word', 'orderByScoreService', '$state', '$timeout',];
        this.remaining = 0;
        this.incorrect = 0;
        this.correct = 0;
        this.rounds = [];
        this.ongoingRoundNo = 0;
        this.ongoingWordNo = 0;
        this.questionT = '';
        this.questionVoiceT = '';
        this.reverse = false;
        this.missedTerms = [];
        this.correctTerms = [];
        this.speakText = true;
        this.finished = false;
        this.answer = '';
        this.onAnswering = true;
        LearnRound.initialize().then(function (da) {
            _this.rounds = LearnRound.rounds;
            //console.log($scope.rounds);
            _this.questionT = _this.question(_this.rounds[_this.ongoingRoundNo][_this.ongoingWordNo]);
            _this.questionVoiceT = _this.questionVoice(_this.rounds[_this.ongoingRoundNo][_this.ongoingWordNo]);
            _this.remaining = LearnRound.total;
            //$scope.remaining=$scope.rounds[$scope.ongoingRoundNo].length;
            _this.rounds.map(function (round) {
                round.map(function (term) {
                    //console.log(term);
                    if (!term.wordAudio)
                        term.wordAudio = new Audio(term.wordVoice);
                    if (!term.meaningAudio)
                        term.meaningAudio = new Audio(term.meaningVoice);
                    return term;
                });
                return round;
            });
            _this.playAudio();
            $scope.ctrl = _this;
        });
    }
    LearnController.prototype.playAudio = function () {
        //var audio = document.createElement('audio');
        //audio.src=$scope.questionVoiceT;
        //if (!$scope.finished) audio.play();
        if (!this.finished) {
            if (!this.reverse)
                this.rounds[this.ongoingRoundNo][this.ongoingWordNo].wordAudio.play();
            if (this.reverse)
                this.rounds[this.ongoingRoundNo][this.ongoingWordNo].meaningAudio.play();
        }
    };
    LearnController.prototype.submit = function () {
        this.check(this.rounds[this.ongoingRoundNo][this.ongoingWordNo], this.answer, this.reverse);
        //next();
        //refresh();
        this.onAnswering = false;
        this.answer = '';
        //$('#moveOn-btn').focus();
        this.$timeout(function () {
            $('#moveOnField').focus();
        }, 100);
    };
    LearnController.prototype.moveOnTextfield = function (e, sthelse) {
        //e.preventDefault();
        //console.log(e.target);
        if (e.keyCode == 13) {
            $(e.target).val('');
            this.moveOn();
        }
    };
    LearnController.prototype.moveOn = function () {
        this.next();
        this.refresh();
        this.onAnswering = true;
        this.$timeout(function () {
            $('input.answer').focus();
        }, 100);
    };
    LearnController.prototype.check = function (term, answer, reverse) {
        var _this = this;
        var final = false;
        //console.log('term: ',term);
        //console.log('answer: ', answer);
        if (reverse == true) {
            if (this.containInWord(answer, term.word)) {
                //if (answer==term.word){
                // TRUE
                final = true;
            }
            else {
                // FALSE
                final = false;
            }
        }
        if (reverse == false) {
            if (this.containInWord(answer, term.meaning)) {
                //if (answer==term.meaning){
                // TRUE
                final = true;
            }
            else {
                // FALSE
                final = false;
            }
        }
        // Update STATUS
        if (final == true) {
            this.rounds[this.ongoingRoundNo][this.ongoingWordNo].status = true;
            this.showResult(this.rounds[this.ongoingRoundNo][this.ongoingWordNo], answer, true);
            var local_ongoingRoundNo = this.ongoingRoundNo, local_ongoingWordNo = this.ongoingWordNo;
            this.Word.updateNoCorrectAns(term._id).then(function (res) {
                //console.log(res);
                _this.rounds[local_ongoingRoundNo][local_ongoingWordNo].NoCorrectAns = res.NoCorrectAns;
                _this.rounds[local_ongoingRoundNo][local_ongoingWordNo].NoWrongAns = res.NoWrongAns;
            });
            // Animation
            $('.resultDiv').removeClass('pulse');
            $('.resultDiv').removeClass('shake');
            $('.resultDiv').removeClass('animated');
            //setTimeout(function(){$('.resultDiv').addClass('animated pulse');},100);
            // ---------
            this.correct++;
        }
        else {
            this.showResult(this.rounds[this.ongoingRoundNo][this.ongoingWordNo], answer, false);
            this.addToMissed(this.rounds[this.ongoingRoundNo][this.ongoingWordNo], answer);
            var local_ongoingRoundNo = this.ongoingRoundNo, local_ongoingWordNo = this.ongoingWordNo;
            this.Word.updateNoWrongAns(term._id).then(function (res) {
                //console.log(res);
                _this.rounds[local_ongoingRoundNo][local_ongoingWordNo].NoCorrectAns = res.NoCorrectAns;
                _this.rounds[local_ongoingRoundNo][local_ongoingWordNo].NoWrongAns = res.NoWrongAns;
            });
            // Animation
            $('.resultDiv').removeClass('animated');
            $('.resultDiv').removeClass('shake');
            $('.resultDiv').removeClass('pulse');
            setTimeout(function () {
                $('.resultDiv').addClass('animated shake');
            }, 100);
            // ---------
            this.incorrect++;
        }
        //next();
        //refresh();
    };
    LearnController.prototype.next = function () {
        if (this.ongoingWordNo !== this.rounds[this.ongoingRoundNo].length - 1) {
            // HAVEN'T REACHED THE END OF THE CURRENT ROUND
            //do{
            this.ongoingWordNo++;
            //console.log($scope.ongoingWordNo);
            if (this.rounds[this.ongoingRoundNo][this.ongoingWordNo].status == true)
                this.next();
        }
        else {
            // HAVE REACHED THE END OF THE THE CURRENT ROUND
            //alert('End of this round');
            //console.log(allCorrect());
            if (!this.allCorrect()) {
                this.ongoingWordNo = 0;
                //while($scope.rounds[$scope.ongoingRoundNo][$scope.ongoingWordNo].status==true && $scope.ongoingWordNo<$scope.rounds[$scope.ongoingRoundNo].length){
                //    $scope.ongoingWordNo++;
                //}
                if (this.rounds[this.ongoingRoundNo][this.ongoingWordNo].status == true)
                    this.next();
            }
            else {
                if (this.ongoingRoundNo !== this.rounds.length - 1) {
                    // THIS IS NOT THE LAST ROUND. MOVE ON TO THE NEXT ROUND
                    this.ongoingWordNo = 0;
                    this.ongoingRoundNo++;
                }
                else {
                    // THIS IS THE LAST ROUND
                    this.finished = true;
                }
            }
        }
    };
    //reset(){
    //    this.reset();
    //}
    LearnController.prototype.reverseCheck = function () {
        //console.log($scope.reverse);
        this.next();
        this.refresh();
    };
    LearnController.prototype.back = function () {
        this.$state.transitionTo('index', { fid: this.rounds[0][0].folderId }, { notify: true });
    };
    LearnController.prototype.allCorrect = function () {
        return this.rounds[this.ongoingRoundNo].every(function (elem, index, array) {
            return elem.status;
        });
    };
    LearnController.prototype.refresh = function () {
        this.questionT = this.question(this.rounds[this.ongoingRoundNo][this.ongoingWordNo], this.reverse);
        this.questionVoiceT = this.questionVoice(this.rounds[this.ongoingRoundNo][this.ongoingWordNo], this.reverse);
        this.remaining = function () {
            var val;
            val = _.flattenDeep(this.rounds).reduce(function (final, cur, index, arr) {
                if (cur.status == false)
                    return final + 1;
                return final;
            }, 0);
            //console.log(_.flattenDeep(this.rounds));
            return val;
        }.call(this);
        if (this.speakText)
            this.playAudio();
    };
    LearnController.prototype.reset = function () {
        this.incorrect = 0;
        this.correct = 0;
        this.ongoingRoundNo = 0;
        this.ongoingWordNo = 0;
        this.questionT = '';
        this.questionVoiceT = '';
        this.missedTerms = [];
        this.correctTerms = [];
        this.finished = false;
        this.rounds.map(function (round) {
            round.map(function (term) {
                term.status = false;
                term.answer = [];
                term.answer.splice(0, term.answer.length);
                return term;
            });
            return round;
        });
        this.currentWordlist = this.orderByScoreService(this.currentWordlist);
        this.refresh();
    };
    LearnController.prototype.question = function (term, reverse) {
        if (reverse)
            return term.meaning;
        return term.word;
    };
    LearnController.prototype.questionVoice = function (term, reverse) {
        if (reverse)
            return term.meaningVoice;
        return term.wordVoice;
    };
    LearnController.prototype.showResult = function (term, answer, correct) {
        this.result = {
            word: term.word,
            meaning: term.meaning,
            example: term.example,
            image: term.image,
            correct: correct,
            answer: answer
        };
        //console.log($scope.result);
    };
    LearnController.prototype.addToMissed = function (term, answer) {
        var i = term;
        if (i.answer == undefined)
            i.answer = [];
        i.answer.push(answer);
        if (this.missedTerms.indexOf(term) == -1)
            this.missedTerms.push(i);
    };
    LearnController.prototype.addToCorrect = function (term) {
        this.correctTerms.push(term);
    };
    LearnController.prototype.containInWord = function (ans, wrd) {
        //console.log('ans: ', ans);
        if (!ans)
            return false;
        var ArrWrd = wrd.split(",");
        var valid = false;
        for (var i = 0; i < ArrWrd.length; i++) {
            ArrWrd[i] = (ArrWrd[i].trim()).toLowerCase();
        }
        //if (Arr)
        if (ans.toLowerCase() === "" || ArrWrd.indexOf(ans.toLowerCase()) === -1) {
            valid = false;
        }
        else
            valid = true;
        return valid;
    };
    return LearnController;
})();
angular.module('controllers').controller('LearnController', LearnController);
//# sourceMappingURL=LearnController2.js.map