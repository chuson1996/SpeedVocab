var _ = require('lodash');
module.exports = function(grunt) {

    // Project configuration.
    var concat = {};
    concat.files = {
        'public/app/controllers/MainController/dist/MainController.js': ['public/app/controllers/MainController/src/**/*.js'],
        'public/app/services/dist/services.js':['public/app/services/src/**/*.js'],
        'public/app/charts/dist/charts.js':['public/app/charts/src/**/*.js'],
        'public/app/relativity_sequence/dist/relativity_sequence.js':['public/app/relativity_sequence/src/**/*.js'],
        'public/app/relativity_sequence/dist/relativity_sequence.css':['public/app/relativity_sequence/src/**/*.css'],
        'public/app/dashboard/dist/dashboard.js':['public/app/dashboard/src/**/*.js'],
        'public/app/notification/dist/notification.js':['public/app/notification/src/**/*.js'],
    };
    concat.watchFiles = _.reduce(concat.files, function (result, val, key) {
        if (typeof val !== 'string'){
            _.forEach(val, function (_val) {
                result.push(_val);
            })
        }
        else{
            result.push(val);
        }
        return result;
    },[]);
    //console.log(concat.watchFiles);

    grunt.initConfig({
        browserify:{
            dist:{
                files:{
                    'public/app/controllers/MainController3.js':['public/app/controllers/MainController/**/*.js']
                }
            },
            options:{
                watch:true,
                keepAlive: true
            }
        },
        concat: {
            options: {
                separator: '\n',
            },
            basic_and_extras: {
                files: concat.files,
            }
        },
        watch: {
            files: concat.watchFiles,
            tasks: ['concat'],

        }

    });

    // Load the plugin that provides the "uglify" task.

    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Default task(s).
    grunt.registerTask('default', ['concat']);

};


