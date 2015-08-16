(function(){
    angular.module('SpeedVocab')
        .config(function ($stateProvider, $urlRouterProvider, $locationProvider, $compileProvider, $provide) {
            $urlRouterProvider.when("","/")
                .otherwise("/");
            $stateProvider
                .state('index', {
                    url: "/?fid",
                    views: {
                        "viewA": {templateUrl: "/speedvocab/template/app"},
                        //"feedbackView":{
                        //    templateUrl: "/speedvocab/template/feedback"
                        //}
                    }
                })
                .state('learn', {
                    views: {
                        "viewA": {
                            templateUrl: "/speedvocab/template/learn",
                        },
                        //"feedbackView":{
                        //    templateUrl: "/speedvocab/template/feedback"
                        //}
                    }
                })
                .state('feedback',{
                    url:"/feedback",
                    views:{
                        "viewA": {templateUrl: "/speedvocab/template/feedback"}
                    }
                });
                //if(window.history && window.history.pushState){
                //    $locationProvider.html5Mode({
                //        enabled: true,
                //        requireBase: false
                //    });
                //}

            //$compileProvider.debugInfoEnabled(false);

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
}())