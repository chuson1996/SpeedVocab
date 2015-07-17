
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
    Feedback.find().then(function(docs){
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
            res.json(toSend);
        })
    }).catch(function(err){
        console.error(err);
        res.status(500).send('Something wrong!');
    });
});

// Folder
router.post('/post/addfolder', function(req,res){
    console.log(req.body);
    new Folder({
        userId: req.session.passport.user,
        name: req.body.folderName,
        fromLang: req.body.fromLang,
        toLang: req.body.toLang,
        createdAt: Date()
    }).save(function(err, doc){
        if (err) return res.status(500).send('Something wrong');
        return res.json(doc);
    });
    //res.send('OK');
});
router.put('/api/editfolder', function(req,res){
    console.log(req.body);
    Folder.update({
        userId: req.session.passport.user,
        _id: req.body._id
    },{
        $set:{
            name: req.body.name,
            fromLang: req.body.fromLang,
            toLang: req.body.toLang
        }
    }, function(err, doc){
        if (err) return res.status(500).send(err);
        return res.send('OK');
    });
    //res.send('Working on it!')
})
router.get('/api/getfolders', function(req,res){
    Folder.find({userId: req.session.passport.user}).then(function(folders){
        var toSend=[];
        if (folders.length===0) {
            var newDefaultFolder = new Folder({
                userId: req.session.passport.user,
                name: 'NO NAME',
                fromLang: 'English',
                toLang: 'English',
                created: Date()
            });
            newDefaultFolder.save();
            //console.log(newDefaultFolder);
            toSend.push(newDefaultFolder);
            //res.send('Testing! Be cool!');
        }
        else{
            //console.log(folders);
            folders.forEach(function(o){
                toSend.push(o);
            });
            //res.send('Testing! Be cool!2');
        }
        res.json(toSend);
    }).catch(console.error);
});
router.get('/api/getfolderById/:folderId', function(req,res){
    Folder.findOne({
        userId: req.session.passport.user,
        _id: req.params.folderId
    }).then(function(folder){
        res.json(folder);
    }).catch(function(){
        res.status(500).send('Folder doesn\'t exist or you are not authorized to access it.')
    })
})
router.delete('/api/deletefolder/:folderid', function(req,res){
    Folder.remove({
        userId: req.session.passport.user,
        _id: req.params.folderid
    }, function(err){
        if(err) return res.status(500).send('Something wrong');
        return res.send('OK');
    })
})

// Words or Terms
router.post('/post/addword', function(req,res){
    var newWord = new Words({
        userId: req.session.passport.user,
        folderId: req.body.folderId,
        word:req.body.addword,
        meaning: req.body.addmeaning,
        example: req.body.addexample,
        image: req.body.addimage,
        NoCorrectAns: 0,
        NoWrongAns: 0,
        createdAt: Date()
    });
    //console.log('The new word: ',newWord);
    newWord.save(function(err){
        if (err) return res.status(501).json(err);
        delete newWord.userId;
        res.json(newWord);
    });
});
router.put('/api/editword/:wordid', function(req,res){
    var wordid= req.params.wordid;
    //console.log(req.body);
    //console.log(wordid);
    Words.update({
        userId: req.session.passport.user,
        _id:wordid,
        folderId: req.body.folderId
    }, {
        $set:{
            userId: req.session.passport.user,
            folderId: req.body.folderId,
            word:req.body.editword,
            meaning: req.body.editmeaning,
            example: req.body.editexample,
            image: req.body.editimage
        }
    },function(err, doc){
        if (err) console.log(err);
        //console.log(doc);
    });
    res.send('OK');
});
router.put('/api/updateNoCorrectAns/:wordid', function(req,res){
    var wordid= req.params.wordid;
    //console.log(wordid);

    Words.findOne({_id: wordid}).select('NoCorrectAns NoWrongAns').then(function(doc){
        //console.log(doc);
        var updateCor=doc.NoCorrectAns+1;
        var updateWor=(doc.NoWrongAns||0)-1;
        if (updateCor>9) updateCor=9;
        if (updateWor>9) updateWor=9;
        if (updateWor<0) updateWor=0;
        if (updateCor<0) updateCor=0;
        if (updateWor>updateCor) updateWor = updateCor;
        Words.update({_id: wordid, userId: req.session.passport.user},{
            $set:{
                NoWrongAns:updateWor,
                NoCorrectAns: updateCor
            }
        }, function(err,doc){
            if (err) throw err;
            res.json({
                _id: wordid,
                NoWrongAns: updateWor,
                NoCorrectAns: updateCor
            });
        });
    });

});
router.put('/api/updateNoWrongAns/:wordid', function(req,res){
    var wordid= req.params.wordid;
    //console.log(wordid);

    Words.findOne({_id: wordid}).select('NoCorrectAns NoWrongAns').then(function(doc){
        //console.log(doc);
        var updateCor=doc.NoCorrectAns-1;
        var updateWor=(doc.NoWrongAns||0)+1;
        if (updateCor>7) updateCor=7;
        if (updateWor>7) updateWor=7;
        if (updateWor<0) updateWor=0;
        if (updateCor<0) updateCor=0;
        if (updateWor>updateCor) updateWor = updateCor;
        Words.update({_id: wordid, userId: req.session.passport.user},{
            $set:{
                NoWrongAns:updateWor,
                NoCorrectAns: updateCor
            }
        }, function(err,doc){
            if (err) throw err;
            res.json({
                _id: wordid,
                NoWrongAns: updateWor,
                NoCorrectAns: updateCor
            });
        });
    });

});
router.delete('/api/deleteword/:wordid', function(req,res){
    var wordid= req.params.wordid;
    console.log(wordid);
    Words.remove({
        userId: req.session.passport.user,
        _id: wordid
    }, function (err) {
        if (err) {
            console.log(err);
            throw err;
        }
    });
    res.send('OK');
});
router.get('/api/getwords/:folderId', function(req,res){
    //console.log(req.session.passport.user, req.query.openingFolder);
    var toSend=[];
    //console.log('Yo yo here here here............',req.query.openingFolder);
    async.parallel({
        folderInfo:function(cb){
            Folder.find({
                userId: req.session.passport.user,
                _id: req.params.folderId
            }).then(function(r){
                    //console.log('Folder....', r);
                    cb(null, r);
            })
        },
        words: function(cb){
            Words.find({userId: req.session.passport.user, folderId: req.params.folderId}).then(function(r){
                cb(null, r)
            })
        }
    }, function(err, results){
        if (err) {
            console.error(err);
            return res.status(500).send('Something goes wrong!');
        }
        var folderInfo = results.folderInfo[0];
        //console.log('folderInfo: ', folderInfo);
        var words = results.words;

        words.forEach(function(term){
            var o={};
            o._id=term._id;
            o.folderId=term.folderId;
            o.word=term.word;
            o.meaning=term.meaning;
            o.example=term.example;
            o.image=term.image;
            o.NoCorrectAns=term.NoCorrectAns;
            o.NoWrongAns=term.NoWrongAns;
            //o.wordVoice="http://www.translate.google.com/translate_tts?tl="+folderInfo.fromLang+"&q="+encodeURI(term.word);
            //o.meaningVoice="http://www.translate.google.com/translate_tts?tl="+folderInfo.toLang+"&q="+encodeURI(term.meaning);
            var voiceList = require('../data/acapela-vaas/voice-list.js');
            o.wordVoice="http://vaas.acapela-group.com/Services/Streamer.ogg?req_voice="+voiceList[folderInfo.fromLang]+"&req_text="+term.word.replace(/ /g, '+')+"&cl_login=EVAL_VAAS&cl_app=EVAL_1187628&cl_pwd=2anoa8wk";
            o.meaningVoice="http://vaas.acapela-group.com/Services/Streamer.ogg?req_voice="+voiceList[folderInfo.toLang]+"&req_text="+term.meaning.replace(/ /g, '+')+"&cl_login=EVAL_VAAS&cl_app=EVAL_1187628&cl_pwd=2anoa8wk";

            o.createdAt = term.createdAt;
            //console.log('after: ',o);
            toSend.push(o);
        });
        res.json(toSend);
    });
});
// Get a single word
router.get('/api/word/:id', function(req,res){
    Words.findOne({ userId:req.session.passport.user, _id:req.params.id}).exec().then(function(word){
        Folder.findOne({userId:req.session.passport.user, _id: word.folderId}).then(function(folder){
            res.json({
                word: word,
                folder: folder
            });
        });

    });
});
router.get('/api/defineWord/:word/:from/:to', function(req,res){
    // These code snippets use an open-source library. http://unirest.io/nodejs
    var from = req.params.from;
    var to = req.params.to;
    var q = encodeURI(req.params.word);
    if (from=='en' && to=='en'){
        unirest.get("https://wordsapiv1.p.mashape.com/words/"+q)
            .header("X-Mashape-Key", "1XzINqg3Rfmshizwhfrgi54LAaX5p1Aj9Y5jsn6roqcGczBBD4")
            .header("Accept", "application/json")
            .end(function (result) {
                //console.log('result: ',result.body);
                //console.log('status: ',result.status);
                if (result.status !== 200) return res.status(500).send('Not found');
                return res.json(result.body);
            });
    }else if (yandexSupportedLangs.indexOf(from,to)){
        rp('https://dictionary.yandex.net/api/v1/dicservice.json/lookup?key=dict.1.1.20150209T212534Z.94adfd8a495e3628.73c2afbdd079b4a53fdbcc4b4c9578b1905112bf&lang='+from+'-'+to+'&text='+q)
            .then(function(response){
                response = JSON.parse(response);
                var toSend = response.def.reduce(function(pre,cur,index,arr){
                    if (!pre[cur.pos]) {
                        pre[cur.pos] = [];
                        //console.log('Initiate pre[cur.pos] -> []');
                    }
                    cur.tr.forEach(function(cur){
                        if (!pre[cur.pos]) pre[cur.pos]=[];
                        //console.log('cur',cur);
                        pre[cur.pos].push(cur.text);

                    })
                    return pre;
                },{});
                console.log(toSend);
                return res.json(toSend);

            })
            .then(null, function(err){
                console.log('Error: ',err);
                return res.status(501).send(err);
            })
    }else{

        var reqUrl ='https://www.googleapis.com/language/translate/v2?key=AIzaSyA27gOVCQo0RMuPDTsVlBnZQYTNPNS3TD4&source='+from+'&target='+to+'&q='+q;
        console.log(reqUrl);
        rp(reqUrl)
            .then(function (response) {
                console.log({
                    from: from,
                    to: to,
                    q: req.params.word,
                    response: response
                });
                var toSend = response.replace(/\n/g,'').replace(/\"/g,'"');
                toSend = JSON.parse(toSend);
                return res.json(toSend.data);
            }, function(err){
                console.log(err.message);
                res.status(501).send(err.message);
            })

    }

});
router.get('/api/defineWordFI2EN/:word', function(req,res){
    var sou = 'fi',
        tar = 'en',
        qq = req.params.word;

    rp('https://dictionary.yandex.net/api/v1/dicservice.json/lookup?key=dict.1.1.20150209T212534Z.94adfd8a495e3628.73c2afbdd079b4a53fdbcc4b4c9578b1905112bf&lang='+sou+'-'+tar+'&text='+qq+'')
        .then(function(response){
            response = JSON.parse(response);
            var toSend = response.def.reduce(function(pre,cur,index,arr){
                if (!pre[cur.pos]) {
                    pre[cur.pos] = [];
                    //console.log('Initiate pre[cur.pos] -> []');
                }
                cur.tr.forEach(function(cur){
                    if (!pre[cur.pos]) pre[cur.pos]=[];
                    //console.log('cur',cur);
                    pre[cur.pos].push(cur.text);

                })
                return pre;
            },{});
            console.log(toSend);
            return res.json(toSend);

        })
        .then(null, function(err){
            console.log('Error: ',err);
            return res.status(500).send(err);
        })

});
var googleImageCrawler = require('../data/googleImageCrawler.js');
router.get("/api/getSuggestedImages/:q", function(req,res){
    var q = encodeURI(req.params.q);
    googleImageCrawler(q).then(function(data){
        //console.log('data(images url): ', data);
        res.json(data);
    });
});

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

// ---------------------------------------------------------------------------------------------------------------------
module.exports = router;