/**
 * Created by chuso_000 on 7/8/2015.
 */
angular.module('relativitySequence')
    .directive('relativitySequenceBoard', function (relativitySequenceFactory) {
        return {
            restrict:'E',
            scope:{},
            templateUrl: '../app/relativity_sequence/dist/relativitySequenceBoard.template.html',
            controller: 'relativitySequenceBoardController as relSeqBoaCtrl',
            link: link
        }
        function link(scope, elem, attrs){
            scope.$on('openRelativitySequence', openRelativitySequence);
            scope.$on('closeRelativitySequence', closeRelativitySequence);
            elem.hide();

            function openRelativitySequence(event, termId, word, meaning){
                scope.relSeqBoaCtrl.termId = termId;
                scope.relSeqBoaCtrl.word = word;
                scope.relSeqBoaCtrl.meaning = meaning;
                relativitySequenceFactory.findByTermId(termId).then(function (doc) {
                    if (doc) {
                        //console.log(doc);
                        scope.relSeqBoaCtrl.note = doc.note;
                        scope.relSeqBoaCtrl.selectedImages = doc.images;
                        scope.relSeqBoaCtrl.currentPhase = 0;
                    }else {
                        scope.relSeqBoaCtrl.currentPhase = 1;
                    }
                    elem.show();
                })
            }
            function closeRelativitySequence(event){
                scope.relSeqBoaCtrl.termId = null;
                scope.relSeqBoaCtrl.word = null;
                scope.relSeqBoaCtrl.meaning = null;
                scope.relSeqBoaCtrl.note = null;
                scope.relSeqBoaCtrl.selectedImages = [];
                scope.relSeqBoaCtrl.currentPhase = 0;
                elem.hide();
            }
        }
    })