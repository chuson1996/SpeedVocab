(function() {
    var app = angular.module('SpeedVocab', ['controllers','ui.router']);
    app.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {

        $stateProvider
            .state('index', {
                url: "",
                views: {
                    "viewA": {templateUrl: "/speedvocab/template/app"}
                }
            })
            .state('learn', {

                views: {
                    "viewA": {templateUrl: "/speedvocab/template/learn"}
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


