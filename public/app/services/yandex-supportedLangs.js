/**
 * Created by chuso_000 on 13/7/2015.
 */
angular.module('services').factory('yandexSupportedLangs', function(){
    var supportedLangs = ["ru-ru","ru-en","ru-pl","ru-uk","ru-de","ru-fr","ru-es","ru-it","ru-tr","en-ru","en-en","en-de","en-fr","en-es","en-it","en-tr","pl-ru","uk-ru","de-ru","de-en","fr-ru","fr-en","es-ru","es-en","it-ru","it-en","tr-ru","tr-en"];
    sl.indexOf = function(from,to){
        return supportedLangs.indexOf(from+"-"+to)>=0?true:false;
    }
    function sl(){
        return supportedLangs;
    }
    return sl;

})