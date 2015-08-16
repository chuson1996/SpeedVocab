/**
 * Created by chuso_000 on 16/8/2015.
 */
//module.exports = wordlistNavigation;
angular.module('controllers')
    .factory('wordlistNavigation', function ($location, $anchorScroll) {
        return wordlistNavigation;

        function wordlistNavigation(){
            var vm = this;
            _.assign(vm,{
                goToFirstPage: goToFirstPage,
                goToLastPage: goToLastPage,
                nextPage: nextPage,
                previousPage: previousPage,
            })

            function goToFirstPage(){
                vm.refreshPage(1);
                $location.hash('twl');
                $anchorScroll();
            }
            function goToLastPage(){
                vm.refreshPage(vm.totalPages);
                $location.hash('twl');
                $anchorScroll();
            }
            function nextPage(){
                vm.openingPage++;
                vm.$data = (vm.currentWordlist).slice((vm.openingPage - 1) * 7, vm.openingPage * 7);
                $location.hash('twl');
                $anchorScroll();
            }
            function previousPage(){
                vm.openingPage--;
                vm.$data = (vm.currentWordlist).slice((vm.openingPage - 1) * 7, vm.openingPage * 7);
                $location.hash('twl');
                $anchorScroll();
            }
        }
    })
