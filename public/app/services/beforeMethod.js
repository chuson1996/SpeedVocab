/**
 * Created by chuso_000 on 13/8/2015.
 */
var app= angular.module('services');
app.factory('beforeMethod',function(){
    return function (object, props, beforeMethod) {
        props.forEach(function (prop) {
            if (typeof object[prop] !== 'function')
                console.error(prop + ' not a function error!');
            else{
                var ori = object[prop];
                object[prop] = function(){
                    beforeMethod();
                    return ori.apply(object, arguments);

                }
            }
        })
    }
})