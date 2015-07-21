var Notification = require('../models/notification.js');
var _ = require('lodash');
var async = require('async');


module.exports = notificationRouter;
function notificationRouter(router){
    // Notification
    router.get("/api/notification", function(req,res,next){
        Notification.find({
            userId: req.session.passport.user,
        }).sort('-createdAt').limit(10).exec(function (err,data) {
            if (err) return next(err);
            if (data.length<2){
                async.parallel(
                    [
                        function (cb) {
                            new Notification({
                                userId: req.session.passport.user,
                                status: true,
                                message: 'Have fun with SpeedVocab!'
                            }).save(function (err, doc) {
                                    if (err) return cb(err);
                                    //console.log(doc);
                                    return cb(null, doc);
                                });
                        },
                        function (cb) {
                            new Notification({
                                userId: req.session.passport.user,
                                message: 'Welcome to SpeedVocab!'
                            }).save(function (err, doc) {
                                    if (err) return cb(err);
                                    //console.log(doc);
                                    return cb(null, doc);
                                });
                        },

                    ],
                    // callback
                    function (err, docs) {
                        if (err) {
                            console.error(err);
                            return next(err);
                        }
                        //console.log('docs',docs);
                        return res.json(docs);
                    });

            }
            else return res.json(data);
        })
    });
    router.put("/api/notification", function(req,res){
        Notification.update({
            userId: req.session.passport.user,
            status: false
        },{
            $set:{
                status: true
            }
        }).exec(function (err, doc) {
            if (err) return res.status(501).send(err);
            console.log(doc);
            return res.send('OK');
        })

    });
}