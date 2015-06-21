/// <reference path="../typings/angular.d.ts" />
var helper;
(function (helper) {
    function getSuggestedImages($http, text) {
        console.log('get suggested images');
        return $http.get('/speedvocab/api/getSuggestedImages/' + encodeURIComponent(text)).then(function (res) {
            //console.log(res.data);
            //$scope.suggestedImages= res.data;
            return res.data;
        });
    }
    helper.getSuggestedImages = getSuggestedImages;
    function orderByScoreFilter(items) {
        var filtered = [];
        if (items === undefined)
            return items;
        items.forEach(function (item) {
            filtered.push(item);
        });
        filtered.sort(function (a, b) {
            if ((a.NoCorrectAns - a.NoWrongAns) == (b.NoCorrectAns - b.NoWrongAns)) {
                return (new Date(a.createdAt) < new Date(b.createdAt)) ? 1 : -1;
            }
            return ((a.NoCorrectAns - a.NoWrongAns) > (b.NoCorrectAns - b.NoWrongAns) ? 1 : -1);
        });
        return filtered;
    }
    helper.orderByScoreFilter = orderByScoreFilter;
    function formatDate(createdAt) {
        var date = new Date(createdAt).getDate();
        var month = new Date(createdAt).getMonth() + 1;
        var year = new Date(createdAt).getFullYear();
        //console.log(new Date(createdAt).getDate());
        //console.log(new Date(createdAt).getMonth()+1);
        //console.log(new Date(createdAt).getFullYear());
        var str = '';
        var monthList = 'Jan Feb Mar April May Jun Jul Aug Sep Oct Nov Dec'.split(' ');
        str += date + ' ' + monthList[month - 1];
        if (year !== new Date().getFullYear())
            str += ' ' + year;
        return str;
    }
    helper.formatDate = formatDate;
})(helper || (helper = {}));
var MainController = (function () {
    function MainController($scope, $http, Word, Folder, AppLearnBridge, $state, $q, $stateParams, $timeout) {
        var _this = this;
        this.$scope = $scope;
        this.$http = $http;
        this.Word = Word;
        this.Folder = Folder;
        this.AppLearnBridge = AppLearnBridge;
        this.$state = $state;
        this.$q = $q;
        this.$stateParams = $stateParams;
        this.$timeout = $timeout;
        this.currentOpeningFolder = '';
        this.totalPages = 0;
        this.currentWordlist = [];
        this.suggestImagesOnLoading = false;
        this.$data = [];
        this.$inject = ['$scope', '$http', 'Word', 'Folder', 'AppLearnBridge', '$state', '$q', '$stateParams', '$timeout'];
        this.loadingDefinition = Word.loadingDefinition;
        console.log('Let\' begin our journey');
        // Get folders
        if ($stateParams.folder) {
            this.currentOpeningFolder = $stateParams.folder;
            this.getWords(this.currentOpeningFolder);
        }
        else {
            Folder.getFolders().then(function (data) {
                _this.folders = data;
                console.log(data);
            });
        }
        this.openingPage = 1;
        this.toTestWords = Word.wordCart;
        //console.log('$stateParams', $stateParams);
    }
    MainController.prototype.formatDate = function (date) {
        return helper.formatDate(date);
    };
    MainController.prototype.openFolder = function (folderId) {
        this.$state.transitionTo('index', { folder: folderId }, { notify: true });
    };
    MainController.prototype.editFolder = function (folder, index) {
        var _this = this;
        //return true;
        return this.Folder.editFolder(folder).then(function (res) {
            _this.folders[index].editing = false;
        });
    };
    MainController.prototype.onError = function (err) {
        console.log('!!!!', err);
    };
    MainController.prototype.resetForm = function () {
        this.newword = '';
        this.newmeaning = '';
        this.newexample = '';
        this.newimage = '';
        this.suggestedImages = [];
    };
    MainController.prototype.refreshPage = function (num) {
        if (num)
            this.openingPage = num;
        else
            this.openingPage = 1;
        this.totalPages = Math.ceil(this.currentWordlist.length / 7);
        this.$data = (this.currentWordlist).slice((this.openingPage - 1) * 7, this.openingPage * 7);
    };
    // Navigation between pages
    MainController.prototype.goToFirstPage = function () {
        this.refreshPage(1);
    };
    MainController.prototype.goToLastPage = function () {
        this.refreshPage(this.totalPages);
    };
    // ------------------------
    MainController.prototype.submit = function () {
        var _this = this;
        var defer = this.$q.defer();
        defer.promise.then(function (res) {
            res.editing = false;
            _this.resetForm();
            //$scope.currentWordlist.push(res);
            _this.Word.words.push(res);
            //$scope.currentWordlist= orderByScoreFilter($scope.currentWordlist);
            _this.Word.words = helper.orderByScoreFilter(_this.Word.words);
            _this.currentWordlist = _this.Word.words;
            _this.refreshPage();
            //
            //this.$apply(function(){
            //
            //});
        }).catch(console.error);
        this.Word.addWord(this.currentOpeningFolder, this.newword, this.newmeaning, this.newexample, this.newimage).then(function (res) {
            defer.resolve(res);
        });
    };
    MainController.prototype.addFolder = function () {
        var _this = this;
        this.Folder.addFolder(this.newnameF, this.newfromLangF, this.newtoLangF).then(function (res) {
            console.log(res);
            _this.folders.push(res.data);
            _this.folders = _this.folders.sort(function (a, b) {
                return new Date(a.createdAt) < new Date(b.createdAt);
            });
            _this.newnameF = '';
            _this.newfromLangF = '';
            _this.newtoLangF = '';
        });
    };
    MainController.prototype.deleteFolder = function (folder) {
        var _this = this;
        this.Folder.deleteFolder(folder._id).then(function (res) {
            console.log(res);
            if (res.data == 'OK') {
                _.remove(_this.folders, function (n) {
                    return n == folder;
                });
            }
        });
    };
    MainController.prototype.getWords = function (folderId) {
        var _this = this;
        console.log('Loading words in folder');
        this.currentOpeningFolder = folderId;
        $('img.loading').show(300);
        $('.viewA').css('opacity', '0.3');
        var defer = this.$q.defer();
        defer.promise.then(function (data) {
            $('img.loading').hide(300);
            $('.viewA').css('opacity', '1');
            data.map(function (item) {
                var i = item;
                item.editing = false;
                item.selectedToCart = false;
                return item;
            });
            //console.log(data);
            _this.currentWordlist = helper.orderByScoreFilter(data);
            _this.toTestWords = _this.Word.wordCart;
            _this.refreshPage();
            $(window).resize();
        });
        this.Word.getWords(folderId).then(function (data) {
            defer.resolve(data);
        });
    };
    MainController.prototype.nextPage = function () {
        this.openingPage++;
        this.$data = (this.currentWordlist).slice((this.openingPage - 1) * 7, this.openingPage * 7);
    };
    MainController.prototype.previousPage = function () {
        this.openingPage--;
        this.$data = (this.currentWordlist).slice((this.openingPage - 1) * 7, this.openingPage * 7);
    };
    MainController.prototype.getSuggestedImages = function (text) {
        var _this = this;
        this.suggestImagesOnLoading = true;
        this.newimage = '';
        helper.getSuggestedImages(this.$http, text).then(function (res) {
            _this.suggestedImages = res;
            _this.suggestImagesOnLoading = false;
        });
    };
    MainController.prototype.selectSuggestedImage = function (image) {
        this.newimage = image;
    };
    MainController.prototype.removeNewImage = function () {
        this.newimage = '';
    };
    //-------------------------- to-test words -------------------------------
    MainController.prototype.toggleToTestWords = function (word, $event) {
        //if (Word.wordCart.indexOf(word._id)==-1){
        if (this.Word.wordCart.indexOf(word) == -1) {
            //$scope.toTestWords.push(wordId);
            //Word.wordCart.push(word._id);
            this.Word.wordCart.push(word);
            word.selectedToCart = true;
        }
        else {
            //$scope.toTestWords.splice($scope.toTestWords.indexOf(wordId), 1);
            //Word.wordCart.splice(Word.wordCart.indexOf(word._id), 1);
            this.Word.wordCart.splice(this.Word.wordCart.indexOf(word), 1);
            word.selectedToCart = false;
        }
        this.toTestWords = this.Word.wordCart;
    };
    MainController.prototype.goToTest = function () {
        this.AppLearnBridge.sharedTerms = this.toTestWords;
        this.$state.go('learn');
    };
    MainController.prototype.backToFolerSelection = function () {
        this.$state.transitionTo('index', { folder: undefined }, { notify: true });
    };
    //------------------------------ Starring --------------------------------
    MainController.prototype.wordLoaded = function () {
        return !!this.Word.words;
    };
    MainController.prototype.selectedAll = function () {
        if (this.Word.wordCart == undefined || this.Word.words == undefined)
            return false;
        return this.Word.wordCart.length === this.Word.words.length;
    };
    MainController.prototype.starAll = function () {
        var _this = this;
        this.Word.wordCart = [];
        this.Word.words.forEach(function (word) {
            //Word.wordCart.push(word._id);
            _this.Word.wordCart.push(word);
        });
        this.currentWordlist.map(function (item) {
            item.selectedToCart = true;
            return item;
        });
        this.toTestWords = this.Word.wordCart;
    };
    MainController.prototype.unstarAll = function () {
        this.Word.wordCart = [];
        this.toTestWords = this.Word.wordCart;
        this.currentWordlist.map(function (item) {
            item.selectedToCart = false;
            return item;
        });
    };
    //selectedUnder6(){
    //    if (this.Word.wordCart==undefined || this.Word.words==undefined) return false;
    //    if (this.Word.wordCart.length===0) return false;
    //    return this.Word.wordCart.every(function(a){
    //        return (a.NoCorrectAns - a.NoWrongAns) < 6;
    //    });
    //}
    MainController.prototype.starUnder6 = function () {
        var _this = this;
        this.Word.wordCart = [];
        this.currentWordlist.map(function (item) {
            if ((item.NoCorrectAns - item.NoWrongAns) < 6) {
                item.selectedToCart = true;
                _this.Word.wordCart.push(item);
            }
            else
                item.selectedToCart = false;
            return item;
        });
        this.toTestWords = this.Word.wordCart;
    };
    MainController.prototype.starCurrentPage = function () {
        var _this = this;
        this.currentWordlist = this.currentWordlist.map(function (item, index) {
            if (index >= (_this.openingPage - 1) * 7 && index < _this.openingPage * 7) {
                if (!item.selectedToCart)
                    _this.Word.wordCart.push(item);
                item.selectedToCart = true;
            }
            return item;
        });
        this.toTestWords = this.Word.wordCart;
    };
    // -------------------- Editing && Deleting Item ---------------------------
    MainController.prototype.editItem = function (item) {
        item.editing = true;
    };
    MainController.prototype.doneEditing = function (item) {
        item.editing = false;
        //console.log(item);
        this.Word.editWord(item._id, this.currentOpeningFolder, item.word, item.meaning, item.example, item.image).then(function (res) {
            //console.log(res);
        });
    };
    MainController.prototype.deleteItem = function (item) {
        this.Word.deleteWord(item._id).then(function (res) {
            console.log('deleted');
        });
        this.currentWordlist.splice(this.currentWordlist.indexOf(item), 1);
        this.refreshPage();
        if (this.Word.wordCart && this.Word.wordCart.length > 0) {
            //if (Word.wordCart.indexOf(item._id)!==-1){
            if (this.Word.wordCart.indexOf(item) !== -1) {
                //Word.wordCart.splice(Word.wordCart.indexOf(item._id),1);
                this.Word.wordCart.splice(this.Word.wordCart.indexOf(item), 1);
            }
        }
    };
    // ------------- Get word's definition
    MainController.prototype.defineWord = function (word) {
        var _this = this;
        this.loadingDefinition = true;
        this.Folder.getFolderById(this.currentOpeningFolder).then(function (res) {
            //console.log(res);
            return _this.Word.defineWord(word, res.fromLang, res.toLang);
        }).then(function (res) {
            //console.log(res);
            _this.loadingDefinition = false;
            _this.newexample = res;
        }).catch(function (err) {
            _this.onError(err);
            _this.loadingDefinition = false;
        });
        //this.Word.defineWord(word, currentFolder.fromLang, currentFolder.toLang)
    };
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
    MainController.prototype.expandExample = function (e) {
        //console.log('expanding...', e.target);
        //console.log('status: ',$(e.target).parents('.row').children('.exampleDiv').css('overflow-y'));
        var parent = $(e.target).parents('.row');
        var exampleDiv = $(e.target).parents('.row').children('.exampleDiv');
        //console.log(parseInt($(e.target).parents('.row').children('.exampleDiv').css('max-height')));
        if (parseInt($(e.target).parents('.row').children('.exampleDiv').css('max-height')) > 160) {
            //console.log('Narrow');
            if (exampleDiv.height() > 160) {
                exampleDiv.css('overflow-y', 'hidden').stop().animate({
                    'max-height': '160px'
                }, 300);
            }
            else {
                //console.log('this run only when height <= 160px');
                exampleDiv.css('overflow-y', 'hidden').css('max-height', '160px');
            }
            //$(e.target).text('More');
            $(e.target).css('transform', '');
        }
        else {
            //console.log('Expand');
            $(e.target).parents('.row').children('.exampleDiv').stop().css('overflow-y', 'auto').animate({
                'max-height': '800px'
            }, 'slow', 'linear', function () {
                exampleDiv.css('max-height', exampleDiv.height() + 30);
            });
            //$(e.target).text('Less');
            $(e.target).css('transform', 'rotate(180deg)');
        }
    };
    MainController.prototype.toggleAddNewBar = function () {
        $('.addnewDiv').stop().toggle('slow', function () {
            $(window).resize();
        });
        $('.addnewToggleBar i').toggleClass('fa-angle-down');
        $('.addnewToggleBar i').toggleClass('fa-angle-up');
    };
    MainController.prototype.hideToggleExampleBool = function (index) {
        var toggleBar = $($('.toggleExampleBar')[index]);
        var exampleDiv = toggleBar.prev();
        var exampleInnerHeight = exampleDiv.height();
        var examplePaddingTop = parseInt(exampleDiv.css('padding-top'));
        var examplePaddingBottom = parseInt(exampleDiv.css('padding-bottom'));
        var exampleHeight = exampleInnerHeight + examplePaddingBottom + examplePaddingTop;
        //console.log('*************Hide Toggle Example Bool*************');
        //console.log('toggleBar: ', toggleBar);
        //console.log('exampleDiv: ', exampleDiv);
        //console.log('exampleHeight of child('+index+'): ', exampleHeight);
        if (exampleHeight < 160) {
            return false;
        }
        return true;
    };
    return MainController;
})();
var app = angular.module('controllers');
app.config(function ($provide) {
    $provide.decorator('taOptions', ['$delegate', function (taOptions) {
        taOptions.toolbar = [
            ['h2', 'p', 'pre', 'quote'],
            ['bold', 'italics', 'underline', 'strikeThrough', 'ul', 'ol'],
            ['justifyLeft', 'justifyCenter', 'justifyRight', 'indent', 'outdent'],
            ['html']
        ];
        return taOptions;
    }]);
});
app.directive('elemReady', function ($parse, $timeout) {
    return {
        restrict: 'A',
        priority: -1000,
        link: function ($scope, elem, attrs) {
            elem.ready(function () {
                $timeout(function () {
                    //console.log('elem: ', elem);
                    //console.log('exampleDiv height: ', $(elem[0]).find('.exampleDiv')[0].offsetHeight);
                    var exampleHeight = $(elem[0]).find('.exampleDiv')[0].offsetHeight;
                    if (exampleHeight < 160) {
                        $(elem[0]).find('.toggleExampleBar').hide();
                    }
                });
            });
        }
    };
});
app.controller('MainController', MainController);
app.filter('orderByScore', function () {
    return helper.orderByScoreFilter;
});
//# sourceMappingURL=MainController2.js.map