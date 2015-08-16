(function(){
    angular.module('SpeedVocab', [
        'textAngular',
        'ui.router',
        'djds4rce.angular-socialshare',

        'controllers',
        'notification',
        'directives',
        'dashboard',
        'relativitySequence'
    ]);

    // controllers
    angular.module('controllers',[
        'ui.router',
        'services',
        'filters',
        'controllers.mainController.folder',
        'controllers.mainController.toTest',
        'controllers.mainController.word',
        'controllers.mainController.wordlist'

    ]);

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

    // Relativity Sequence
    angular.module('relativitySequence',['services','ng-sortable','textAngular']);

}())