(function(){
    angular.module('SpeedVocab', ['controllers','ui.router','notification','directives','dashboard']);

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
    angular.module('dashboard',['productivity','charts']);
    //// Productivity
    angular.module('productivity',[]);

    // Notification
    angular.module('notification',[]);

}())