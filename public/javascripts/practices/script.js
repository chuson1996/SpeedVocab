angular.module('app',['ui.router'])
    .config(function($stateProvider) {
        $stateProvider.state('index',{
            url:'/:id',
            template: 'This is index',
            controller: function($stateParams){
                console.log('$stateParams in index page: ', $stateParams);
            }
        })
    })