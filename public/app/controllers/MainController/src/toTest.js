/**
 * Created by chuso_000 on 16/8/2015.
 */
//var toTestStar = require('./toTest.star');
//module.exports = toTest;
angular.module('controllers.mainController.toTest',[])
    .factory('mainControllerToTest', function (toTestStar, $state, AppLearnBridge) {
        return toTest;

        function toTest(){
            var vm = this;
            _.assign(vm,{
                toggleToWordCart: toggleToWordCart,
                goToTest: goToTest,
            })
            toTestStar.call(vm);

            function toggleToWordCart(word,$event) {
                //if (Word.wordCart.indexOf(word._id)==-1){
                if (vm.wordCart.indexOf(word)==-1){
                    //$scope.toTestWords.push(wordId);
                    //Word.wordCart.push(word._id);
                    vm.wordCart.push(word);
                    word.selectedToCart=true;

                }else{
                    //$scope.toTestWords.splice($scope.toTestWords.indexOf(wordId), 1);
                    //Word.wordCart.splice(Word.wordCart.indexOf(word._id), 1);
                    vm.wordCart.splice(vm.wordCart.indexOf(word), 1);
                    word.selectedToCart=false;
                }
                //this.toTestWords = this.Word.wordCart;
            }
            function goToTest(){
                if (vm.wordCart.length>0){
                    AppLearnBridge.sharedTerms = vm.wordCart;
                    $state.go('learn');
                }else{
                    alert('You must select more than 1 term to learn!')
                }


            }
        }
    });
