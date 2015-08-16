/**
 * Created by chuso_000 on 16/8/2015.
 */
//module.exports = wordlistTermDisplay;
angular.module('controllers')
    .factory('wordlistTermDisplay', function ($q, $timeout, Word, helper) {
        return wordlistTermDisplay;

        function wordlistTermDisplay(){
            var vm = this;
            _.assign(vm,{
                getWords: getWords,
                wordLoaded: wordLoaded,
                expandExample: expandExample,
                hideToggleExampleBool: hideToggleExampleBool,
            })

            function getWords(folderId){
                //console.log('Loading words in folder');
                vm.currentOpeningFolder=folderId;
                //$('img.loading').show(300);
                $('.viewA').animate({
                    opacity:0.3
                },1000);
                var defer = $q.defer();

                defer.promise.then(function (data){
                    if (data) vm.openingPage= 1;
                    //$('img.loading').hide(300);
                    $('.viewA').stop().animate({
                        opacity:1
                    },1000);
                    data.map(function(item){
                        var i = item;
                        item.editing=false;
                        item.selectedToCart=false;
                        return item;
                    });
                    //console.log(data);
                    vm.currentWordlist= helper.orderByScoreFilter(data);
                    vm.toTestWords = [];

                    vm.refreshPage();
                    $timeout(function () {
                        $(window).resize();
                    },0);

                });
                Word.getWords(folderId).then(function(data){
                    defer.resolve(data);
                });
            }
            function wordLoaded(){
                return !!vm.currentWordlist;
            }
            function expandExample(e){
                //console.log('expanding...', e.target);
                //console.log('status: ',$(e.target).parents('.row').children('.exampleDiv').css('overflow-y'));
                var parent=$(e.target).parents('.row');
                var exampleDiv = $(e.target).parents('.row').children('.exampleDiv');
                //console.log(parseInt($(e.target).parents('.row').children('.exampleDiv').css('max-height')));
                if (parseInt($(e.target).parents('.row').children('.exampleDiv').css('max-height'))>160){
                    //console.log('Narrow');
                    if (exampleDiv.height()>160){
                        exampleDiv
                            .css('overflow-y','hidden')
                            .stop()
                            .animate({
                                'max-height':'160px'
                            },300);
                    }else{
                        //console.log('this run only when height <= 160px');
                        exampleDiv
                            .css('overflow-y','hidden')
                            .css('max-height','160px')
                    }
                    //$(e.target).text('More');
                    $(e.target).css('transform','');
                }else{
                    //console.log('Expand');
                    $(e.target).parents('.row').children('.exampleDiv')
                        .stop()
                        .css('overflow-y','auto')
                        .animate({
                            'max-height':'800px'
                        },'slow','linear',function(){
                            exampleDiv.css('max-height',exampleDiv.height()+30);
                        })

                    //$(e.target).text('Less');
                    $(e.target).css('transform','rotate(180deg)');
                    //.css('max-height','2000px')
                    //.css('overflow-y','visible');
                }
            }
            function hideToggleExampleBool(index){

                var toggleBar = $($('.toggleExampleBar')[index]);
                var exampleDiv =toggleBar.prev();

                var exampleInnerHeight = exampleDiv.height();
                var examplePaddingTop = parseInt(exampleDiv.css('padding-top'));
                var examplePaddingBottom= parseInt(exampleDiv.css('padding-bottom'));
                var exampleHeight = exampleInnerHeight + examplePaddingBottom +examplePaddingTop;
                //console.log('*************Hide Toggle Example Bool*************');
                //console.log('toggleBar: ', toggleBar);
                //console.log('exampleDiv: ', exampleDiv);
                //console.log('exampleHeight of child('+index+'): ', exampleHeight);
                if (exampleHeight<160)
                {
                    //console.log(false);
                    return false;
                }
                //console.log(true);
                return true;
            }
        }
    })
