(function() {
    var app = angular.module('SpeedVocab', ['controllers','ui.router']);
    app.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
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



    });


}());


