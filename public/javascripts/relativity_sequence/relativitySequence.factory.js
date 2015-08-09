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