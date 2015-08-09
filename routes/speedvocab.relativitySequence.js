/**
 * Created by chuso_000 on 9/8/2015.
 */
var User = require('../models/user');
var Word = require('../models/word');
var RelativitySequence = require('../models/relativitySequence');

var q = require('q');
var _ = require('lodash');
var async = require('async');

module.exports = relSeqAPI;
function relSeqAPI(router){
    router.get('/api/relativitySequence/:termId', function (req, res) {
        RelativitySequence.findOne({
            term: req.params.termId
        }).exec(function (err, doc) {
            if (err) return res.status(501).send(err);
            return res.json(doc);
        })
    });
    router.post('/api/relativitySequence/:termId', function (req, res) {
        RelativitySequence.findOne({
            term: req.params.termId
        }).exec(function (err, doc) {
            if (err) return res.status(501).send(err);
            if (!doc){
                new RelativitySequence({
                    term: req.params.termId,
                    note: req.body.note,
                    images: req.body.images
                }).save(function (err) {
                        if (err) return res.status(501).send(err);
                        return res.send('OK');
                    })
            }else{
                doc.note = req.body.note;
                doc.images = req.body.images;
                doc.save(function (err) {
                    if (err) return res.status(501).send(err);
                    return res.send('OK');
                });
            }
        })

    })
}