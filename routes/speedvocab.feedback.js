var User = require('../models/user.js');
var Feedback = require('../models/feedback.js');
var _ = require('lodash');
var async = require('async');

module.exports = feedbackRouter;

function feedbackRouter(router){
    // Feedback
    router.post('/post/addfeedback', function(req,res){

        new Feedback({
            userId: req.session.passport.user,
            content: req.body.content,
            createdAt: Date()
        }).save(function(err, doc){
                if (err) return res.status(500).send('Something wrong!');
                return res.json(doc);
            })
    });
    router.get('/api/getfeedbacks', function(req,res){
        Feedback.find().then(function(docs, err){
            if (err) return res.status(501).send(err);
            var useridArr = _.pluck(docs,'userId');
            //console.log('useridArr: ', useridArr);
            User.find({
                _id: {
                    $in: useridArr
                }
            },'avatar', function(err, usersWithAva){
                //console.log('usersWithAva: ', usersWithAva);
                if (err) return res.status(500).send('Something wrong!');
                var toSend = _.map(docs, function(o){
                    var avatar = _.find(usersWithAva, function(n){ return n._id == o.userId}).avatar;
                    var userId = o.userId;
                    var content = o.content;
                    var createdAt = o.createdAt;
                    return {
                        userId: userId,
                        avatar: avatar,
                        content: content,
                        createdAt: createdAt
                    }
                });
                //console.log('toSend: ', toSend);
                return res.json(toSend);
            })
        });
    });
}
