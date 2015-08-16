/**
 * Created by chuso_000 on 16/8/2015.
 */
//module.exports = toTestStar;
angular.module('controllers')
    .factory('toTestStar', function () {
        return toTestStar;

        function toTestStar(){
            var vm = this;
            _.assign(vm,{
                starAll: starAll,
                unstarAll: unstarAll,
                starUnder6: starUnder6,
                starCurrentPage: starCurrentPage,
            })


            function starAll(){
                vm.wordCart=[];
                vm.currentWordlist.forEach(function(word){
                    //Word.wordCart.push(word._id);
                    vm.wordCart.push(word);
                });
                vm.currentWordlist.map(function(item){
                    item.selectedToCart = true;
                    return item;
                });
                //this.wordCart = this.Word.wordCart;
            }
            function unstarAll(){
                vm.wordCart=[];
                //this.wordCart = this.Word.wordCart;
                vm.currentWordlist.map(function(item){
                    item.selectedToCart = false;
                    return item;
                });
            }
            function starUnder6(){
                vm.wordCart=[];
                vm.currentWordlist.map(function(item){
                    if ((item.NoCorrectAns - item.NoWrongAns) < 6)
                    {
                        item.selectedToCart = true;
                        vm.wordCart.push(item);
                    }
                    else item.selectedToCart = false;
                    return item;
                });
                //this.wordCart = this.Word.wordCart;
            }
            function starCurrentPage(){
                vm.currentWordlist = vm.currentWordlist.map(function(item, index){
                    if (index>= (vm.openingPage - 1)*7 && index<vm.openingPage*7){
                        if (!item.selectedToCart)
                            vm.wordCart.push(item);
                        item.selectedToCart = true;
                    }
                    return item;
                });
                //this.wordCart = this.Word.wordCart;
            }
        }
    });
