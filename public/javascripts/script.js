(function() {
    var app = angular.module('SpeedVocab', ['controllers','ui.router']);
    app.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
        $urlRouterProvider.when("","/")
            .otherwise("/");
        $stateProvider
            .state('index', {
                url: "/",
                views: {
                    "viewA": {templateUrl: "/speedvocab/template/app"}
                }
            })
            .state('learn', {

                views: {
                    "viewA": {templateUrl: "/speedvocab/template/learn"}
                }
            });


    });


}());


