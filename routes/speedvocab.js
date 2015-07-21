
var Folder = require('../models/folder.js');
var Words = require('../models/word.js');
var User = require('../models/user.js');
var Feedback = require('../models/feedback.js');
var Notification = require('../models/notification.js');

var unirest = require('unirest');
var rp = require('request-promise');
var express = require('express');
var router = express.Router();
var _ = require('lodash');
var async = require('async');
var yandexSupportedLangs = require('../data/yandex-supportedLangs');




router.get('', function(req,res){
    //console.log(req.session.detail);
    res.render('speedvocab', req.session.detail);
});
router.get('/logout', function (req, res, next) {
    req.logout();
    req.session.destroy(function (err) {
        res.redirect('/'); //Inside a callback… bulletproof!
    });
})
router.get('/template/app', function(req,res){
    //console.log(req.session.detail);
    if (req.session.detail)
        return res.render('app2', req.session.detail);
    return res.send('Out of session!');
});
router.get('/template/learn', function(req,res){
    res.render('learn2');
});
router.get('/template/feedback', function(req,res){
    res.render('feedback', req.session.detail);
});




var folderRouter = require('./speedvocab.folder.js');
folderRouter(router);
var wordRouter = require('./speedvocab.word.js');
wordRouter(router);
var feedbackRouter = require('./speedvocab.feedback.js');
feedbackRouter(router);
var notificationRouter = require('./speedvocab.notification.js');
notificationRouter(router);


// ---------------------------------------------------------------------------------------------------------------------
module.exports = router;