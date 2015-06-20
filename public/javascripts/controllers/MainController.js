(function(app){

    function getSuggestedImages($http,$scope, text){
        console.log('get suggested images');
        return $http.get('/speedvocab/api/getSuggestedImages/'+encodeURIComponent(text)).then(function(res){
            //console.log(res.data);
            $scope.suggestedImages= res.data;
        });
    }

    //function encodeFlickrImageUrl(photo){
    //    var url='http://farm'+photo.farm+'.staticflickr.com/'+photo.server+'/'+photo.id+'_'+photo.secret+'.jpg';
    //    return url;
    //}
    app.controller('MainController', ['$scope','$http','Word','Folder','AppLearnBridge','$state', function($scope,$http,Word,Folder,AppLearnBridge,$state){

        $scope.resetForm=function(){
            $scope.newword = '';
            $scope.newmeaning='';
            $scope.newexample='';
            $scope.newimage='';
            $scope.suggestedImages=[];
            //console.log('Form reseted');
        };
        //------------------------  Add Words ------------------------------
        $scope.currentOpenningFolder = '';
        $scope.totalPages=0;
        $scope.currentWordlist=[];
        $scope.loadingDefinition = Word.loadingDefinition;

        // Update items on the table
        $scope.refreshPage = function(num){
            // console.log('Refresh Page');
            if (num) $scope.openingPage = num;
            else $scope.openingPage=1;
            $scope.totalPages = Math.ceil($scope.currentWordlist.length/10);
            $scope.$data = ($scope.currentWordlist).slice(($scope.openingPage - 1) * 10, $scope.openingPage * 10);

        };
        $scope.goToFirstPage = function(){
            $scope.refreshPage(1);
        };
        $scope.goToLastPage = function(){
            $scope.refreshPage($scope.totalPages);
        };
        $scope.submit = function(){
            Word.addWord($scope.currentOpenningFolder, $scope.newword, $scope.newmeaning, $scope.newexample, $scope.newimage).then(function(res){
                res.editing = false;
                $scope.resetForm();
                $scope.$apply(function(){
                    //$scope.currentWordlist.push(res);
                    Word.words.push(res);
                    //$scope.currentWordlist= orderByScoreFilter($scope.currentWordlist);
                    Word.words= orderByScoreFilter(Word.words);
                    $scope.currentWordlist = Word.words;
                    $scope.refreshPage();
                });

                //document.getElementById("AddNewForm").reset();


            });
        };
        //------------------------- Folders -----------------------------

        Folder.getFolders().then(function(data){
            $scope.folders = data;
        });
        $scope.addFolder = function(){
            //addFolder();
            Folder.addFolder();
        };
        $scope.openingPage = 1;
        // -------------------------- getWords -----------------------------

        $scope.getWords = function(folderId){

            //console.log('clicked');
            $scope.currentOpenningFolder=folderId;
            $('img.loading').show(300);
            $('.viewA').css('opacity','0.3');
            Word.getWords(folderId).then(function(data){
                $('img.loading').hide(300);
                $('.viewA').css('opacity','1');
                data.map(function(item){
                    var i = item;
                    item.editing=false;
                    item.selectedToCart=false;
                    return item;
                });
                //console.log(data);
                $scope.currentWordlist= orderByScoreFilter(data);
                $scope.toTestWords = Word.wordCart;

                $scope.refreshPage();
            });


        };

        $scope.nextPage = function(){
            $scope.openingPage++;
            $scope.$data = ($scope.currentWordlist).slice(($scope.openingPage - 1) * 10, $scope.openingPage * 10);
        };
        $scope.previousPage = function(){
            $scope.openingPage--;
            $scope.$data = ($scope.currentWordlist).slice(($scope.openingPage - 1) * 10, $scope.openingPage * 10);
        };
        $scope.expandExample = function(e){
            //console.log('expanding...', e.target);
            //console.log('status: ',$(e.target).parents('.wrap-exampleDiv').children('.exampleDiv').css('overflow-y'));
            var parent=$(e.target).parents('.wrap-exampleDiv');
            var exampleDiv = $(e.target).parents('.wrap-exampleDiv').children('.exampleDiv');
            //console.log(parseInt($(e.target).parents('.wrap-exampleDiv').children('.exampleDiv').css('max-height')));
            if (parseInt($(e.target).parents('.wrap-exampleDiv').children('.exampleDiv').css('max-height'))>160){
                //console.log('Narrow');
                //console.log('Height');
                if (parseInt(exampleDiv.height())>160){
                    exampleDiv
                        .css('max-height',exampleDiv.height())
                        .stop()
                        .animate({
                            'max-height':'160px'
                        },300);
                }else{
                    //console.log('This run only when height <= 160px');
                    exampleDiv
                        .css('max-height','160px')
                }
                //$(e.target).text('More');
                $(e.target).css('transform','');
            }else{
                //console.log('Expand');
                $(e.target).parents('.wrap-exampleDiv').children('.exampleDiv')
                    .stop()
                    .animate({
                        'max-height':'500px'
                    },300);
                //$(e.target).text('Less');
                $(e.target).css('transform','rotate(180deg)');
                    //.css('max-height','2000px')
                    //.css('overflow-y','visible');
            }

            //console.log('status: ',$(e.target).parents('.wrap-exampleDiv').children('.exampleDiv').css('overflow-y'));
        };

        //----------------------- Get Suggested Images ---------------------------
        $scope.getSuggestedImages = function(text){
            $scope.suggestImagesOnLoading = true;
            getSuggestedImages($http,$scope,text).then(function(){
                $scope.suggestImagesOnLoading = false;
            });
        };

        $scope.selectSuggestedImage = function(image){
            //console.log(image);
            $scope.newimage=image;
        };
        $scope.removeNewImage=function(){
            $scope.newimage='';
        };

        //-------------------------- to-test words -------------------------------
        $scope.toTestWords = Word.wordCart;
        $scope.toggleToTestWords = function(word,$event){
            //if (Word.wordCart.indexOf(word._id)==-1){
            if (Word.wordCart.indexOf(word)==-1){
                //$scope.toTestWords.push(wordId);
                //Word.wordCart.push(word._id);
                Word.wordCart.push(word);
                word.selectedToCart=true;

            }else{
                //$scope.toTestWords.splice($scope.toTestWords.indexOf(wordId), 1);
                //Word.wordCart.splice(Word.wordCart.indexOf(word._id), 1);
                Word.wordCart.splice(Word.wordCart.indexOf(word), 1);
                word.selectedToCart=false;
            }
            $scope.toTestWords = Word.wordCart;
        }
        $scope.goToTest = function(){
            AppLearnBridge.sharedTerms = $scope.toTestWords;
            //window.location.href = '/speedvocab/#/learn';
            $state.go('learn');
            //$.post('/speedvocab/storeTestingWordsToSession',{
            //
            //    toTestWords: $scope.toTestWords
            //}, function(res){
            //    if (res=='OK')
            //        window.location.href = '/speedvocab/#/learn';
            //});
        };


        // ---------------- Starring -------------------
        $scope.wordLoaded= function(){
            return !(Word.words==undefined);
        };
        $scope.selectedAll = function(){
            if (Word.wordCart==undefined || Word.words==undefined) return false;
            return Word.wordCart.length===Word.words.length;
        };
        $scope.starAll = function(){
            Word.wordCart=[];
            Word.words.forEach(function(word){
                //Word.wordCart.push(word._id);
                Word.wordCart.push(word);
            });
            $scope.currentWordlist.map(function(item){
                item.selectedToCart = true;
                return item;
            });
            $scope.toTestWords = Word.wordCart;
        };
        $scope.unstarAll = function(){
            Word.wordCart=[];
            $scope.toTestWords = Word.wordCart;
            $scope.currentWordlist.map(function(item){
                item.selectedToCart = false;
                return item;
            });
        };
        //$scope.selectedUnder6 = function(){
        //    if (Word.wordCart==undefined || Word.words==undefined) return false;
        //    if (Word.wordCart.length===0) return false;
        //    return Word.wordCart.every(function(a){
        //        return (a.NoCorrectAns - a.NoWrongAns) < 6;
        //    });
        //};
        $scope.starUnder6 = function(){
            Word.wordCart=[];
            Word.words.forEach(function(word){
                if ((word.NoCorrectAns - word.NoWrongAns) < 6)
                {
                    Word.wordCart.push(word);
                }
            });
            $scope.currentWordlist.map(function(item){
                if ((item.NoCorrectAns - item.NoWrongAns) < 6)
                    item.selectedToCart = true;
                return item;
            });
            $scope.toTestWords = Word.wordCart;
        };


        // -------------------- Editing && Deleting Item ---------------------------
        $scope.editItem = function(item){
            item.editing=true;
        };
        $scope.doneEditing = function(item){
            item.editing=false;
            //console.log(item);
            Word.editWord(item._id,$scope.currentOpenningFolder, item.word, item.meaning, item.example, item.image).then(function(res){
                //console.log(res);
            });
        };
        $scope.deleteItem = function(item){
            Word.deleteWord(item._id).then(function(res){

            });
            $scope.currentWordlist.splice($scope.currentWordlist.indexOf(item),1);
            $scope.refreshPage();
            if (Word.wordCart && Word.wordCart.length>0){
                //if (Word.wordCart.indexOf(item._id)!==-1){
                if (Word.wordCart.indexOf(item)!==-1){
                    //Word.wordCart.splice(Word.wordCart.indexOf(item._id),1);
                    Word.wordCart.splice(Word.wordCart.indexOf(item),1);
                }
            }

        };
        // ------------- Get word's definition

        $scope.defineWord = function(word){
            $scope.loadingDefinition=true;
            Word.defineWord(word).then(function(res){
                //console.log(res);
                $scope.loadingDefinition=false;
                $scope.newexample=Word.paraphaseToExample(res);
            }).catch(function(err){
                onError(err);
                $scope.loadingDefinition=false;
            });
        };
        $scope.defineWordFI2EN = function(word){
            $scope.loadingDefinition=true;
            Word.defineWordFI2EN(word).then(function(res){
                $scope.loadingDefinition=false;
                $scope.newexample=Word.paraphaseToExampleFI2EN(res);
            }).catch(function(err){
                onError(err);
                $scope.loadingDefinition=false;
            });
        };

    }]);



    function onError(err){
        console.log('!!!!',err);
    }
    function orderByScoreFilter(items){
        var filtered=[];
        if (items === undefined) return items;
        items.forEach(function(item){
            filtered.push(item);
        });
        filtered.sort(function(a,b){
            if ((a.NoCorrectAns- a.NoWrongAns) == (b.NoCorrectAns- b.NoWrongAns)){
                return new Date(a.createdAt) < new Date(b.createdAt);
            }

            return ((a.NoCorrectAns- a.NoWrongAns) >(b.NoCorrectAns- b.NoWrongAns) ? 1: -1);

        });
        return filtered;
    }
    app.filter('orderByScore', function(){
        return orderByScoreFilter;
    });

}(function(){
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
    return app;
}()))
