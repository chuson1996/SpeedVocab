/**
 * Created by chuso_000 on 19/6/2015.
 */
/// <reference path="../typings/angular.d.ts" />
declare var _;
interface ILoading{
    definition: boolean;
    imageSuggestion: boolean;
    wordCollection: boolean;
}
class MainController{
    newword: string;
    newmeaning: string;
    newexample: string;
    newimage: string;


    newnameF: string;
    newfromLangF: string;
    newtoLangF: string;

    suggestedImages: string[];

    currentOpeningFolder: string='';
    totalPages: number = 0;
    currentWordlist: string[] = [];
    loadingDefinition: boolean;
    openingPage :number=0;

    $data = [];
    toTestWords;
    folders;

    loading:ILoading = {
        definition :false,
        imageSuggestion : false,
        wordCollection: false
    };

    $inject=['$scope','$http','Word','Folder','AppLearnBridge','$state','$q','$stateParams','$timeout','helper','$anchorScroll','$location'];
    constructor(public $scope, public $http, public Word, public Folder, public AppLearnBridge, public $state, public $q, public $stateParams, public $timeout, public helper, public $anchorScroll, public $location){
        var vm = this;
        this.loadingDefinition = Word.loadingDefinition;

        //this.openingPage= 1;
        this.toTestWords = Word.wordCart;
        //console.log('$stateParams', $stateParams);

        activate();

        ////
        function activate(){
            console.log('Let\' begin our journey');
            // Get folders

            if ($stateParams.fid){
                vm.currentOpeningFolder = $stateParams.fid;
                vm.getWords(vm.currentOpeningFolder);

            }else{

                Folder.getFolders().then((data)=>{
                    vm.folders = data;
                    //console.log(data);
                });
            }
        }
    }
    playAudio(term, type){
        if (type==false){
            if (!term.wordAudio)
                term.wordAudio = new Audio(term.wordVoice);
            term.wordAudio.play();
            //term.wordAudio.play();
        }else if (type==true){
            if (!term.meaningAudio)
                term.meaningAudio = new Audio(term.meaningVoice);
            term.meaningAudio.play();
            //term.meaningAudio.play();
        }
        //this.$http({
        //    method:'GET',
        //    url: term.wordVoice,
        //    headers:{
        //        'responseType':'audio/mpeg',
        //        referrer:null
        //    }
        //}).then(function(rRes){
        //    console.log(rRes);
        //})
        //console.log(term.wordVoice);
    }
    formatDate(date){
        return this.helper.formatDate(date);
    }
    openFolder(folderId){
        this.$state.transitionTo('index',{fid: folderId},{notify:true});
    }
    editFolder(folder, index){
        //return true;
        return this.Folder.editFolder(folder).then((res)=>{
            this.folders[index].editing=false;
        });
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
        this.$location.hash('twl');
        this.$anchorScroll();
    }
    goToLastPage(){
        this.refreshPage(this.totalPages);
        this.$location.hash('twl');
        this.$anchorScroll();
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
            this.Word.words= this.helper.orderByScoreFilter(this.Word.words);
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
        this.Folder.addFolder(this.newnameF, this.newfromLangF, this.newtoLangF).then((res)=>{
            console.log(res);
            this.folders.push(res.data)
            this.folders = this.folders.sort(function(a,b){
                return new Date(a.createdAt) < new Date(b.createdAt);
            });
            this.newnameF = '';
            this.newfromLangF = '';
            this.newtoLangF = '';
        });
    }
    deleteFolder(folder){
        this.Folder.deleteFolder(folder._id).then((res)=>{
            console.log(res);
            if (res.data=='OK'){
                _.remove(this.folders, function(n){
                    return n==folder;
                })
            }
        });
    }
    getWords(folderId){
        console.log('Loading words in folder');
        this.currentOpeningFolder=folderId;
        //$('img.loading').show(300);
        $('.viewA').animate({
            opacity:0.3
        },1000);
        var defer = this.$q.defer();

        defer.promise.then((data)=>{
            if (data) this.openingPage= 1;
            //$('img.loading').hide(300);
            $('.viewA').stop().animate({
                opacity:1
            },1000);
            data.map((item)=>{
                var i = item;
                item.editing=false;
                item.selectedToCart=false;
                return item;
            });
            //console.log(data);
            this.currentWordlist= this.helper.orderByScoreFilter(data);
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
        this.$location.hash('twl');
        this.$anchorScroll();
    }
    previousPage(){
        this.openingPage--;
        this.$data = (this.currentWordlist).slice((this.openingPage - 1) * 7, this.openingPage * 7);
        this.$location.hash('twl');
        this.$anchorScroll();
    }
    getSuggestedImages(text: string){
        this.loading.imageSuggestion = true;
        this.newimage='';
        this.helper.getSuggestedImages(this.$http,text).then((res)=>{
            this.suggestedImages=res;
            this.loading.imageSuggestion = false;
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
        this.loading.definition = true;
        this.Folder.getFolderById(this.currentOpeningFolder).then((res)=>{
            //console.log(res);
            return this.Word.defineWord(word, res.fromLang, res.toLang);
        }).then((res)=>{
            //console.log(res);
            this.loading.definition=false;
            this.newexample=res;
        }).catch((err)=>{
            this.onError(err);
            this.loading.definition=false;
        });

        //this.Word.defineWord(word, currentFolder.fromLang, currentFolder.toLang)
    }
    //defineWordFI2EN(word){
    //    this.loadingDefinition=true;
    //    this.Word.defineWordFI2EN(word).then(function(res){
    //        this.loadingDefinition=false;
    //        this.newexample=res;
    //    }).catch(function(err){
    //        this.onError(err);
    //        this.loadingDefinition=false;
    //    });
    //}
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
            //console.log(false);
            return false;
        }
        //console.log(true);
        return true;
    }
    //folderMouseOver(e){
    //    $(e.target).css('background-color','gray');
    //}

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
                    //if (exampleHeight<160)
                    //{
                    //    $(elem[0]).find('.toggleExampleBar').hide();
                    //}

                });
            })
        }
    }
});
app.controller('MainController', MainController);
app.filter('orderByScore', function(){
    return this.helper.orderByScoreFilter;
});