/**
 * Created by chuso_000 on 19/6/2015.
 */
/// <reference path="../typings/angular.d.ts" />

module helper{
    export function getSuggestedImages($http,text){
        console.log('get suggested images');
        return $http.get('/speedvocab/api/getSuggestedImages/'+encodeURIComponent(text)).then(function(res){
            //console.log(res.data);
            //$scope.suggestedImages= res.data;
            return res.data;
        });
    }
    export function orderByScoreFilter(items){
        var filtered=[];
        if (items === undefined) return items;
        items.forEach(function(item){
            filtered.push(item);
        });
        filtered.sort(function(a,b){
            if ((a.NoCorrectAns- a.NoWrongAns) == (b.NoCorrectAns- b.NoWrongAns)){
                return (new Date(a.createdAt) < new Date(b.createdAt))? 1: -1;
            }

            return ((a.NoCorrectAns- a.NoWrongAns) >(b.NoCorrectAns- b.NoWrongAns) ? 1: -1);

        });
        return filtered;
    }
}
class MainController{
    newword: string;
    newmeaning: string;
    newexample: string;
    newimage: string;

    suggestedImages: string[];

    currentOpeningFolder: string='';
    totalPages: number = 0;
    currentWordlist: string[] = [];
    loadingDefinition: boolean;
    openingPage :number;
    suggestImagesOnLoading: boolean = false;
    $data = [];
    toTestWords;
    folders;
    $inject=['$scope','$http','Word','Folder','AppLearnBridge','$state','$q','$stateParams','$timeout'];
    constructor(public $scope, public $http, public Word, public Folder, public AppLearnBridge, public $state, public $q, public $stateParams, public $timeout){

        this.loadingDefinition = Word.loadingDefinition;
        console.log('Let\' begin our journey');
        // Get folders

        if ($stateParams.folder){
            this.currentOpeningFolder = $stateParams.folder;
            this.getWords(this.currentOpeningFolder);
        }else{

            Folder.getFolders().then((data)=>{
                this.folders = data;
                console.log(data);
            });
        }
        this.openingPage= 1;
        this.toTestWords = Word.wordCart;
        //console.log('$stateParams', $stateParams);


    }
    openFolder(folderId){
        this.$state.transitionTo('index',{folder: folderId},{notify:true});
    }
    onError(err){
        console.log('!!!!',err);
    }
    resetForm(){
        this.newword = '';
        this.newmeaning='';
        this.newexample='';
        this.newimage='';
        this.suggestedImages=[];
    }
    refreshPage(num?: number){
        if (num) this.openingPage = num;
        else this.openingPage=1;
        this.totalPages = Math.ceil(this.currentWordlist.length/7);
        this.$data = (this.currentWordlist).slice((this.openingPage - 1) * 7, this.openingPage * 7);
    }
    // Navigation between pages
    goToFirstPage(){
        this.refreshPage(1);
    }
    goToLastPage(){
        this.refreshPage(this.totalPages);
    }
    // ------------------------
    submit(){
        var defer = this.$q.defer();
        defer.promise.then((res)=>{
            res.editing = false;
            this.resetForm();

            //$scope.currentWordlist.push(res);
            this.Word.words.push(res);
            //$scope.currentWordlist= orderByScoreFilter($scope.currentWordlist);
            this.Word.words= helper.orderByScoreFilter(this.Word.words);
            this.currentWordlist = this.Word.words;
            this.refreshPage();
            //
            //this.$apply(function(){
            //
            //});
        }).catch(console.error);
        this.Word.addWord(this.currentOpeningFolder, this.newword, this.newmeaning, this.newexample, this.newimage).then(function(res){
            defer.resolve(res);
        });
    }
    addFolder(){
        var newname=prompt('Name of the folder: ');
        var newfromLang=prompt('fromLang: ');
        var newtoLang=prompt('toLang: ');
        this.Folder.addFolder(newname, newfromLang, newtoLang);
    }
    getWords(folderId){
        console.log('Loading words in folder');
        this.currentOpeningFolder=folderId;
        $('img.loading').show(300);
        $('.viewA').css('opacity','0.3');
        var defer = this.$q.defer();

        defer.promise.then((data)=>{
            $('img.loading').hide(300);
            $('.viewA').css('opacity','1');
            data.map((item)=>{
                var i = item;
                item.editing=false;
                item.selectedToCart=false;
                return item;
            });
            //console.log(data);
            this.currentWordlist= helper.orderByScoreFilter(data);
            this.toTestWords = this.Word.wordCart;

            this.refreshPage();
            $(window).resize();
        })
        this.Word.getWords(folderId).then(function(data){
            defer.resolve(data);
        });
    }
    nextPage(){
        this.openingPage++;
        this.$data = (this.currentWordlist).slice((this.openingPage - 1) * 7, this.openingPage * 7);
    }
    previousPage(){
        this.openingPage--;
        this.$data = (this.currentWordlist).slice((this.openingPage - 1) * 7, this.openingPage * 7);
    }
    getSuggestedImages(text: string){
        this.suggestImagesOnLoading = true;
        this.newimage='';
        helper.getSuggestedImages(this.$http,text).then((res)=>{
            this.suggestedImages=res;
            this.suggestImagesOnLoading = false;
        });
    }
    selectSuggestedImage(image){
        this.newimage = image;
    }
    removeNewImage(){
        this.newimage='';
    }

    //-------------------------- to-test words -------------------------------
    toggleToTestWords(word,$event) {
        //if (Word.wordCart.indexOf(word._id)==-1){
        if (this.Word.wordCart.indexOf(word)==-1){
            //$scope.toTestWords.push(wordId);
            //Word.wordCart.push(word._id);
            this.Word.wordCart.push(word);
            word.selectedToCart=true;

        }else{
            //$scope.toTestWords.splice($scope.toTestWords.indexOf(wordId), 1);
            //Word.wordCart.splice(Word.wordCart.indexOf(word._id), 1);
            this.Word.wordCart.splice(this.Word.wordCart.indexOf(word), 1);
            word.selectedToCart=false;
        }
        this.toTestWords = this.Word.wordCart;
    }
    goToTest(){
        this.AppLearnBridge.sharedTerms = this.toTestWords;
        this.$state.go('learn');

    }
    backToFolerSelection(){
        this.$state.transitionTo('index',{folder: undefined},{notify:true});
    }
    //------------------------------ Starring --------------------------------
    wordLoaded(){
        return !!this.Word.words;
    }
    selectedAll(){
        if (this.Word.wordCart==undefined || this.Word.words==undefined) return false;
        return this.Word.wordCart.length===this.Word.words.length;
    }
    starAll(){
        this.Word.wordCart=[];
        this.Word.words.forEach((word)=>{
            //Word.wordCart.push(word._id);
            this.Word.wordCart.push(word);
        });
        this.currentWordlist.map(function(item: any){
            item.selectedToCart = true;
            return item;
        });
        this.toTestWords = this.Word.wordCart;
    }
    unstarAll(){
        this.Word.wordCart=[];
        this.toTestWords = this.Word.wordCart;
        this.currentWordlist.map(function(item:any){
            item.selectedToCart = false;
            return item;
        });
    }
    //selectedUnder6(){
    //    if (this.Word.wordCart==undefined || this.Word.words==undefined) return false;
    //    if (this.Word.wordCart.length===0) return false;
    //    return this.Word.wordCart.every(function(a){
    //        return (a.NoCorrectAns - a.NoWrongAns) < 6;
    //    });
    //}
    starUnder6(){
        this.Word.wordCart=[];
        this.currentWordlist.map((item: any)=>{
            if ((item.NoCorrectAns - item.NoWrongAns) < 6)
            {
                item.selectedToCart = true;
                this.Word.wordCart.push(item);
            }
            else item.selectedToCart = false;
            return item;
        });
        this.toTestWords = this.Word.wordCart;
    }
    starCurrentPage(){
        this.currentWordlist = this.currentWordlist.map((item:any, index)=>{
            if (index>= (this.openingPage - 1)*7 && index<this.openingPage*7){
                if (!item.selectedToCart)
                    this.Word.wordCart.push(item);
                item.selectedToCart = true;
                }
            return item;
        });
        this.toTestWords = this.Word.wordCart;
    }
    // -------------------- Editing && Deleting Item ---------------------------
    editItem(item){
        item.editing=true;
    }
    doneEditing(item){
        item.editing=false;
        //console.log(item);
        this.Word.editWord(item._id,this.currentOpeningFolder, item.word, item.meaning, item.example, item.image).then(function(res){
            //console.log(res);
        });
    }
    deleteItem(item){
        this.Word.deleteWord(item._id).then(function(res){
            console.log('deleted');
        });
        this.currentWordlist.splice(this.currentWordlist.indexOf(item),1);
        this.refreshPage();
        if (this.Word.wordCart && this.Word.wordCart.length>0){
            //if (Word.wordCart.indexOf(item._id)!==-1){
            if (this.Word.wordCart.indexOf(item)!==-1){
                //Word.wordCart.splice(Word.wordCart.indexOf(item._id),1);
                this.Word.wordCart.splice(this.Word.wordCart.indexOf(item),1);
            }
        }
    }
    // ------------- Get word's definition
    defineWord(word){
        this.loadingDefinition=true;
        this.Word.defineWord(word).then(function(res){
            //console.log(res);
            this.loadingDefinition=false;
            this.newexample=this.Word.paraphaseToExample(res);
        }).catch(function(err){
            this.onError(err);
            this.loadingDefinition=false;
        });
    }
    defineWordFI2EN(word){
        this.loadingDefinition=true;
        this.Word.defineWordFI2EN(word).then(function(res){
            this.loadingDefinition=false;
            this.newexample=this.Word.paraphaseToExampleFI2EN(res);
        }).catch(function(err){
            this.onError(err);
            this.loadingDefinition=false;
        });
    }
    // --------------- Functions involved DOM manipulation ---------------------
    expandExample(e){
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
    toggleAddNewBar(){
        $('.addnewDiv').stop().toggle('slow', function(){
            $(window).resize();
        });
        $('.addnewToggleBar i').toggleClass('fa-angle-down');
        $('.addnewToggleBar i').toggleClass('fa-angle-up');
    }
    hideToggleExampleBool(index){

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
            return false;
        }
        return true;
    }

}
var app = angular.module('controllers');
app.config(function($provide){
    $provide.decorator('taOptions',['$delegate', function(taOptions){
        taOptions.toolbar = [
            ['h2','p', 'pre', 'quote'],
            ['bold', 'italics', 'underline', 'strikeThrough', 'ul', 'ol'],
            ['justifyLeft', 'justifyCenter', 'justifyRight', 'indent', 'outdent'],
            ['html']
        ];
        return taOptions;
    }]);
});
app.directive( 'elemReady', function( $parse, $timeout ) {
    return {
        restrict: 'A',
        priority: -1000,
        link: function( $scope, elem, attrs ) {

            elem.ready(function(){
                $timeout(()=>{
                    //console.log('elem: ', elem);
                    //console.log('exampleDiv height: ', $(elem[0]).find('.exampleDiv')[0].offsetHeight);
                    var exampleHeight = $(elem[0]).find('.exampleDiv')[0].offsetHeight;
                    if (exampleHeight<160)
                    {
                        $(elem[0]).find('.toggleExampleBar').hide();
                    }

                });
            })
        }
    }
});
app.controller('MainController', MainController);
app.filter('orderByScore', function(){
    return helper.orderByScoreFilter;
});