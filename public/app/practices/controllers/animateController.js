(function(app){

    app.controller('animateCtrl',function(){
        var self = this;
        var animateCollection ="bounce flash pulse rubberBand shake swing tada wobble jello bounceIn bounceInDown bounceInLeft bounceInRight bounceInUp bounceOut bounceOutDown bounceOutLeft bounceOutRight bounceOutUp fadeIn fadeInDown fadeInDownBig fadeInLeft fadeInLeftBig fadeInRight fadeInRightBig fadeInUp fadeInUpBig fadeOut fadeOutDown fadeOutDownBig fadeOutLeft fadeOutLeftBig fadeOutRight fadeOutRightBig fadeOutUp fadeOutUpBig flipInX flipInY flipOutX flipOutY lightSpeedIn lightSpeedOut rotateIn rotateInDownLeft rotateInDownRight rotateInUpLeft rotateInUpRight rotateOut rotateOutDownLeft rotateOutDownRight rotateOutUpLeft rotateOutUpRight hinge rollIn rollOut zoomIn zoomInDown zoomInLeft zoomInRight zoomInUp zoomOut zoomOutDown zoomOutLeft zoomOutRight zoomOutUp slideInDown slideInLeft slideInRight slideInUp slideOutDown slideOutLeft slideOutRight slideOutUp";
        self.animateCollection = _.sortBy(animateCollection.split(' '),function(a,b){ return a > b});

        self.generateRandomColor = function($index){
            //console.log($index);
            var bc = $('.color-div:nth-child('+($index+1)+')').css('background-color').toString().replace(/ /g,'');
            //console.log(bc);
            if (bc=='rgba(0,0,0,0)')
                return 'rgba('+Math.ceil(Math.random()*256)+','+Math.ceil(Math.random()*256)+','+Math.ceil(Math.random()*256)+',0.6)';
            else
                return bc;
        };
        self.startAnimation = function(item, e){
            //console.log(e.target);
            //console.log(item);

            $(e.target).removeClass('animated '+item);

            setTimeout(function(){$(e.target).addClass('animated '+item);},100);
        };
        self.onChaosMode = false;
        self.chaosMode = function(){
            $('.color-div').addClass('infinite');
            self.onChaosMode = true;
        };
        self.stopChaosMode = function(){
            $('.color-div').removeClass('infinite');
            self.onChaosMode = false;
        }

    })
}(angular.module('app')))
