/**
 * Created by chuso_000 on 1/5/2015.
 */
(function() {
    var services = angular.module('services', []);
    services.service('printArr',function(){
        this.printArr = function(obj){
            //console.log('Start with length: '+obj.length);
            for (var i=0;i<obj.length;i++){
                console.log(i+' '+obj[i]);
            }
        };
    })
});