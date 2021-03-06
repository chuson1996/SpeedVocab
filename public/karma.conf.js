// Karma configuration
// Generated on Tue Aug 18 2015 10:19:06 GMT+0300 (FLE Daylight Time)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
      'bower_components/angular/angular.min.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'bower_components/angular-ui-router/release/angular-ui-router.min.js',
      'bower_components/angular-animate/angular-animate.min.js',
      'bower_components/angular-ui-sortable/sortable.js',
      'bower_components/angular-ui-sortable/ng-sortable.js',
      'bower_components/jquery/dist/jquery.min.js',
      'bower_components/lodash/lodash.min.js',
      'bower_components/d3/d3.min.js',
      'app/lib/textAngular.min.js',
      'app/lib/textAngular-rangy.min.js',
      'app/lib/textAngular-sanitize.min.js',

      'app/app.module.js',
      'app/app.config.js',
      'app/app.run.js',

      'app/services/dist/services.js',
      'app/filters/orderByScoreFilter.js',
      'app/controllers/LearnController2.js',
      'app/controllers/MainController/dist/MainController.js',
      'app/controllers/FeedbackController.js',
      'app/directives/languageSelection.js',
      'app/notification/dist/notification.js',
      'app/dashboard/dist/dashboard.js',
      'app/charts/dist/charts.js',
      'app/relativity_sequence/dist/relativity_sequence.js',

      'test/**/*.js',
    ],


    // list of files to exclude
    exclude: [
      'bower_components/bootstrap/**/*.js',
      'bower_components/jquery-ui/**/*.js',
      'app/practices/**/*.js',
      'app/**/src/**/*.js'
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  })
}

