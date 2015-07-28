/**
 * Created by chuso_000 on 28/7/2015.
 */
var q = require('q');
var User = require('../models/user');
var Word = require('../models/word');
var _ = require('lodash');
var async = require('async');


module.exports = productivityAPI;
function productivityAPI(router){
    router.get('/api/productivity', function (req, res, next) {
        //var today = moment().startOf('day');
        //console.log(today);
        //var sevenDaysAgo = moment(today).subtract(7,'days');
        //console.log(sevenDaysAgo);
        var userId;
        userId = req.session.passport.user;
        var query={
            userId: userId,
        };
        console.log(query.userId);
        Word.find(query).sort('-createdAt').select('createdAt').exec(function (err, docs) {
            if (err) return res.status(501).send(err);
            var r1 = _.reduce(_.groupBy(docs, function (d) {
                return new Date(d.createdAt.getYear(), d.createdAt.getMonth(), d.createdAt.getDate());
            }), function (result, val, key) {
                result[key] = val.length;
                return result;
            },{});
            var r2 = _.reduce(r1, function (result, val, key) {
                result.push({
                    time: key,
                    amount: val
                });
                return result;
            },[]);
            var r3 = _.take(r2,10);

            return res.json(r3);
        })
    })
}