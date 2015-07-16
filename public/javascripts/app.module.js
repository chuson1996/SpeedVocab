(function(){
    angular.module('SpeedVocab', ['controllers','ui.router','notification','directives']);

    // controllers
    angular.module('controllers',['services','textAngular','filters','ui.router']);

    // services
    angular.module('services',[]);

    // filters
    angular.module('filters',[]);

    // directives
    angular.module('directives',[]);

    // --- Application Feature
    // Dashboard
    angular.module('dashboard',[]);

    // Notification
    angular.module('notification',[]);

}())