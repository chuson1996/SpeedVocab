/**
 * Created by chuso_000 on 7/8/2015.
 */
angular.module('relativitySequence')
    .directive('relativitySequence', function () {
        return {
            restrict: 'E',
            scope: {
                termId: '=',
                word: '=',
                meaning: '='
            },
            templateUrl:'../javascripts/relativity_sequence/relativitySequence.template.html',
            controller: 'relativitySequenceController as relSeqCtrl',
            link: link,
        }
        //
        function link(scope, elem, attrs){
            scope.relSeqCtrl.termId = scope.termId;
            scope.relSeqCtrl.word = scope.word;
            scope.relSeqCtrl.meaning = scope.meaning;
        }
    });