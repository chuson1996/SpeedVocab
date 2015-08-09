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