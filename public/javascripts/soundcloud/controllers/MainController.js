/**
 * Created by chuso_000 on 26/5/2015.
 */
function initialize(){
    // Things you want to implement before assign Angular
    return angular.module('globalear',['ui.router']);
}

(function(app){
    app.config(function($stateProvider, $urlRouterProvider, $locationProvider){
        $urlRouterProvider.otherwise("/404");
        $stateProvider
            .state('index', {
                url: "",
                views: {
                    "viewA": { templateUrl: "/soundcloud/template/main" }
                }
            })
            .state('404',{
                url: "404",
                views:{
                    "viewA": {template: "<h1>404</h1>"}
                }
            })

    });
    var mainController = function($scope, $q){
        SC.initialize({
            client_id: 'bcd339ae0bc6c31cdf96a0ea301f5558',
            redirect_uri: 'http://localhost:3000/soundcloud/auth/callback'
        });
        //SC.connect(function() {
        //    //SC.get('/me', function(me) {
        //    //    alert('Hello, ' + me.username);
        //    //    console.log(me);
        //    //});
        //});
        var track_url = 'https://soundcloud.com/juss-ladykillah';
        SC.oEmbed(track_url, {auto_play: false}, function (oEmbed) {
            //console.log('oEmbed response: ' , oEmbed);
            $('#SoundCloudWidget').append(oEmbed.html);
        });
        var self = this;
        self.stringQuery = 'random';
        self.$scope = $scope;
        self.$q = $q;
    };
    mainController.prototype.getSoundInTrack = function(){
        // returns the list of sound objects.
        var iframeElement = document.querySelector('iframe');
        var widget = SC.Widget(iframeElement);
        widget.getSounds(function(sounds){
            console.log(sounds);
        });
    };
    mainController.prototype.getCurrentSound = function(){
        var iframeElement = document.querySelector('iframe');
        var widget = SC.Widget(iframeElement);
        widget.getCurrentSound(function(sound){
            console.log(sound);
        });
    };
    mainController.prototype.searchTrack = function(){
        var self =this;
        self.$q(function(resolve, reject) {
            SC.get('/tracks', {tags: 'happy'}, function (tracks) {
                resolve(tracks);
            })
        }).then(function(tracks){
            self.randomTracks = tracks;
        });
        // another way to get it done
        //SC.get('/tracks', {tags: 'happy'}, function (tracks) {
        //    self.$scope.$apply(function(){self.randomTracks = tracks;})
        //})
    }
    app.controller('MainController', mainController)
}(initialize()));