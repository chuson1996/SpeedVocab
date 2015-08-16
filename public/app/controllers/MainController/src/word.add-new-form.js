/**
 * Created by chuso_000 on 16/8/2015.
 */
//module.exports = wordAddNewForm;
angular.module('controllers')
    .factory('wordAddNewForm', function ($http, helper) {
        return wordAddNewForm;

        function wordAddNewForm(){
            var vm = this;
            _.assign(vm,{
                resetForm: resetForm,
                getSuggestedImages: getSuggestedImages,
                selectSuggestedImage: selectSuggestedImage,
                removeNewImage: removeNewImage,
                toggleAddNewBar: toggleAddNewBar,
            })
            function resetForm(){
                vm.newword = '';
                vm.newmeaning='';
                vm.newexample='';
                vm.newimage='';
                vm.suggestedImages=[];
            }
            function getSuggestedImages(text){
                vm.loading.imageSuggestion = true;
                vm.newimage='';
                helper.getSuggestedImages(text).then(function(res){
                    vm.suggestedImages=res;
                    vm.loading.imageSuggestion = false;
                });
            }
            function selectSuggestedImage(image){
                vm.newimage = image;
            }
            function removeNewImage(){
                vm.newimage='';
            }
            function toggleAddNewBar(){
                $('.addnewDiv').stop().toggle('slow', function(){
                    $(window).resize();
                });
                $('.addnewToggleBar i').toggleClass('fa-angle-down');
                $('.addnewToggleBar i').toggleClass('fa-angle-up');
            }
        }
    })
