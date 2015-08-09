/**
 * Created by chuso_000 on 1/8/2015.
 */
var q = require('q');
var User = require('../models/user');

var Point = require('../models/point');
var Word = require('../models/word');
var _ = require('lodash');
var async = require('async');

module.exports = pointRouter;
function pointRouter(router){
    router.get("/api/point", firstStartValidator, function (req, res) {
        var currentUser = req.session.passport.user;
        Point.findOne({
            userId: currentUser
        }).select('point updatedAt').exec(function (err, doc) {
            if (err) return res.status(501).send(err);
            return res.json(doc);
        })

    });
    router.put('/api/point/:case', function (req, res) {
        var Case = req.params.case;
        var currentUser = req.session.passport.user;
        var casesEnum = ['facebook-share','twitter-share'];

        async.waterfall([function (cb) {
            Point.findOne({
                userId: currentUser
            }).exec(function (err, doc) {
                if (err) return cb(err);
                return cb(null, doc);
            })
        }, function (doc, cb) {
            var updatedPoint = parseInt(doc.point);
            if (Case == 'none'){
                updatedPoint = parseInt(doc.point)+1;
            } else if(_.indexOf(casesEnum, Case) > -1){

                if (_.indexOf(doc.casesDone, Case) <= -1)
                {
                    updatedPoint = parseInt(doc.point)+10;
                    doc.casesDone.push(Case);
                    doc.save(function (err) {
                        if (err) return cb(err);
                    })
                }


            } else {
                return cb('Unknown case');
            }
            // Update Point
            console.log(updatedPoint);
            Point.update({
                userId: currentUser
            },{
                $set:{
                    point: updatedPoint
                }
            }, function (err) {
                if (err) return cb(err);
                return cb(null);
            })

        }], function (err) {
            if (err) return res.status(501).send(err);
            return res.send('OK');
        })


    })
}
function firstStartValidator(req, res, next){
    var currentUser = req.session.passport.user;
    Point.find({
        userId: currentUser
    }).exec(function (err, docs) {
        if (err) return next(err);
        if (docs.length==0){
            Word.count({
                userId: currentUser
            }).exec(function (err, no) {
                if (err) return next(err);
                new Point({
                    userId: currentUser,
                    point: no
                }).save(function (err) {
                        if (err) return next(err);
                        return next();
                    })
            })

        }
        else return next();
    })
}
