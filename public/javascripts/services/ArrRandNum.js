/**
 * Created by chuso_000 on 1/5/2015.
 */
(function(){
    var services = angular.module('services');
    services.factory('ArrRandNum',function(){
        var ArrRandNum = function (lengthNum){
            var arr = [];
            for (var i=0; i<lengthNum;i++){
                var RandNum = Math.round(Math.random()*(lengthNum-1));
                if (i===0){
                    arr[i]=RandNum;
                }else{
                    if(arr.indexOf(RandNum)==-1){
                        arr[i]=RandNum;
                    }else{
                        do{
                            RandNum=Math.round(Math.random()*(lengthNum-1));
                        }while(arr.indexOf(RandNum)!=-1);
                        arr[i]=RandNum;
                    }
                }

            }
            return arr;
        }
        return function(oriArr){
            var tarArr=[];
            var ARN = ArrRandNum(oriArr.length);
            for(var i=0; i<oriArr.length; i++){
                tarArr.push(oriArr[ARN[i]]);
            }
            return tarArr;
        }


    });



}());