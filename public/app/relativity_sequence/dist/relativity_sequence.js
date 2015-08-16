/**
 * Created by chuso_000 on 7/8/2015.
 */
angular.module('relativitySequence')
    .controller('relativitySequenceController', relativitySequenceController);

function relativitySequenceController($rootScope){
    var relSeqCtrl = this;
    relSeqCtrl.openRelSeqBoa = function () {
        $rootScope.$broadcast('openRelativitySequence', relSeqCtrl.termId, relSeqCtrl.word, relSeqCtrl.meaning);
    }


}
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
            templateUrl:'../app/relativity_sequence/dist/relativitySequence.template.html',
            controller: 'relativitySequenceController as relSeqCtrl',
            link: link,
        }
        //
        function link(scope, elem, attrs){
            //scope.relSeqCtrl.termId = scope.termId;
            //scope.relSeqCtrl.word = scope.word;
            //scope.relSeqCtrl.meaning = scope.meaning;

            scope.$watch('termId', function () {
                scope.relSeqCtrl.termId = scope.termId;
            });
            scope.$watch('word', function () {
                scope.relSeqCtrl.word = scope.word;
            });
            scope.$watch('meaning', function () {
                scope.relSeqCtrl.meaning = scope.meaning;
            });
        }
    });
/**
 * Created by chuso_000 on 9/8/2015.
 */
angular.module('relativitySequence')
    .factory('relativitySequenceFactory', relativitySequenceFactory);

function relativitySequenceFactory($http){
    return{
        findByTermId: findByTermId,
        post: post
    }
    function findByTermId(termId){
        return $http.get('/speedvocab/api/relativitySequence/'+termId).then(function (res) {
            return res.data;
        })
    }
    function post(termId, note, images){
        return $http.post('/speedvocab/api/relativitySequence/'+termId,{
            note:note,
            images: images
        }).then(function (res) {
            return res.data;
        })
    }
}
/**
 * Created by chuso_000 on 7/8/2015.
 */
angular.module('relativitySequence')
    .controller('relativitySequenceBoardController', relativitySequenceBoardController);

function relativitySequenceBoardController($http, $rootScope, helper, relativitySequenceFactory){
    var relSeqBoaCtrl = this;
    relSeqBoaCtrl.selectedImages = [];
    relSeqBoaCtrl.sortableOptions = {
        animation:150,
        onEnd: function (/**Event*/evt) {

            //console.log(evt.newIndex);  // element's new index within parent
        },
    };

    relSeqBoaCtrl.getRelatedImages = getRelatedImages;
    relSeqBoaCtrl.addToSelectedImages = addToSelectedImages;
    relSeqBoaCtrl.removeFromSelectedImages = removeFromSelectedImages;
    relSeqBoaCtrl.nextPhase = nextPhase;
    relSeqBoaCtrl.previosPhase= previousPhase;
    relSeqBoaCtrl.closeBoard= closeBoard;
    relSeqBoaCtrl.findByTermId = findByTermId;
    relSeqBoaCtrl.submit = submit;

    function getRelatedImages(key){
        return helper.getSuggestedImages($http, key).then(function (res, err) {
            relSeqBoaCtrl.relatedImages = res;
        })
    }
    function addToSelectedImages(imgLink){
        relSeqBoaCtrl.selectedImages.push(imgLink);
    }
    function removeFromSelectedImages(index){
        _.pullAt(relSeqBoaCtrl.selectedImages, index);
    }
    function nextPhase(){
        if (relSeqBoaCtrl.currentPhase<3)
            relSeqBoaCtrl.currentPhase++;
    }
    function previousPhase(){
        if (relSeqBoaCtrl.currentPhase>1 || ((!!relSeqBoaCtrl.note || relSeqBoaCtrl.images.length>0) && relSeqBoaCtrl.currentPhase>0))
            relSeqBoaCtrl.currentPhase--;
    }
    function closeBoard(){
        $rootScope.$broadcast('closeRelativitySequence');
    }
    function submit(){
        post(relSeqBoaCtrl.termId, relSeqBoaCtrl.note, relSeqBoaCtrl.selectedImages);
    }
    function findByTermId(termId){
        relativitySequenceFactory.findByTermId(termId).then(function (res) {
            console.log(res);
        })
    }
    function post(termId, note, images){
        relativitySequenceFactory.post(termId, note, images).then(function (res) {
            if (res == 'OK'){
                alert('Success');
            }
        })
    }
}
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