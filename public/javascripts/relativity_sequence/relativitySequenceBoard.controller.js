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