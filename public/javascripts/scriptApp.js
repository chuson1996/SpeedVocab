/**
 * Created by chuso_000 on 4/5/2015.
 */
(function(){

    function getSuggestedImages($http,$scope, text){
        $http.get('/speedvocab/api/flickr/'+encodeURIComponent(text)).then(function(res){
            var wordImages=[];
            res.data.forEach(function(photo){
                wordImages.push(encodeFlickrImageUrl(photo));
            });
            console.log(wordImages);
            $scope.wordImages= wordImages;
        });
    }

    function encodeFlickrImageUrl(photo){
        var url='http://farm'+photo.farm+'.staticflickr.com/'+photo.server+'/'+photo.id+'_'+photo.secret+'.jpg';
        return url;
    }


    var app = angular.module('SpeedVocab',['textAngular']);
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

    app.controller('MainController', ['$scope','$http','Word','Folder', function($scope,$http,Word,Folder){

        $scope.range = function(n) {
            return new Array(n);
        };
        $scope.resetForm=function(){
            $scope.newword = '';
            $scope.newmeaning='';
            $scope.newexample='';
            $scope.newimage='';
            $scope.wordImages=[];
            //console.log('Form reseted');
        };
        //------------------------  Add Words ------------------------------
        $scope.currentOpenningFolder = '';
        $scope.currentWordlist=[];
        $scope.refreshPage = function(num){
            // console.log('Refresh Page');
            if (num) $scope.openingPage = num;
            else $scope.openingPage=1;
            $scope.$data = ($scope.currentWordlist).slice(($scope.openingPage - 1) * 10, $scope.openingPage * 10);
        };
        $scope.submit = function(){
            Word.addWord($scope.currentOpenningFolder, $scope.newword, $scope.newmeaning, $scope.newexample, $scope.newimage).then(function(res){
                res.editing = false;
                $scope.resetForm();
                $scope.$apply(function(){
                    $scope.currentWordlist.push(res);
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
            Word.getWords(folderId).then(function(data){

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
        }

        //----------------------- Get Suggested Images ---------------------------
        $scope.getSuggestedImages = function(text){
            getSuggestedImages($http,$scope,text);

        };

        $scope.suggestedImageBtn = function(image){
            //console.log(image);
            $scope.newimage=image;
        };
        $scope.removeNewImage=function(){
            $scope.newimage='';
        }

        //-------------------------- to-test words -------------------------------
        $scope.toTestWords = Word.wordCart;
        $scope.toggleToTestWords = function(word,$event){
            if (Word.wordCart.indexOf(word._id)==-1){
                //$scope.toTestWords.push(wordId);
                Word.wordCart.push(word._id);
                word.selectedToCart=true;

            }else{
                //$scope.toTestWords.splice($scope.toTestWords.indexOf(wordId), 1);
                Word.wordCart.splice(Word.wordCart.indexOf(word._id), 1);
                word.selectedToCart=false;
            }
            $scope.toTestWords = Word.wordCart;
        }
        $scope.goToTest = function(){
            $.post('/speedvocab/storeTestingWordsToSession',{
                toTestWords: $scope.toTestWords
            }, function(res){
                if (res=='OK')
                    window.location.href = '/speedvocab/learn';
            });
        }


        // ---------------- Starring -------------------
        $scope.selectedAll = function(){
            //console.log('Checking...');
            //console.log('Word.wordCart==undefined',Word.wordCart==undefined);
            //console.log('Word.words==undefined',Word.words==undefined);
            //console.log(Word.wordCart==undefined || Word.words==undefined);

            if (Word.wordCart==undefined || Word.words==undefined) return false;
            return Word.wordCart.length===Word.words.length;

        };
        $scope.wordLoaded= function(){
            return !(Word.words==undefined);
        };
        $scope.starAll = function(){
            Word.wordCart=[];
            Word.words.forEach(function(word){
                Word.wordCart.push(word._id);
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
        }

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
            if ($scope.wordCart && $scope.wordCart.length>0)
                if ($scope.wordCart.indexOf(item)!==-1){
                    $scope.wordCart.splice($scope.wordCart.indexOf(item),1);
                }
        };
        // ------------- Get word's definition
        $scope.defineWord = function(word){
            Word.defineWord(word).then(function(res){
                //console.log(res);
                $scope.newexample=Word.paraphaseToExample(res);
            }, onError);
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
            return ((a.NoCorrectAns- a.NoWrongAns) >(b.NoCorrectAns- b.NoWrongAns) ? 1: -1);

        });
        return filtered;
    }
    app.filter('orderByScore', function(){
        return orderByScoreFilter;
    });


}());

