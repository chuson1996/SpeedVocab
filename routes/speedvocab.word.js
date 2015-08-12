var Folder = require('../models/folder.js');
var Words = require('../models/word.js');
var User = require('../models/user.js');
var unirest = require('unirest');
var rp = require('request-promise');
var express = require('express');
var router = express.Router();
var _ = require('lodash');
var async = require('async');
var yandexSupportedLangs = require('../data/yandex-supportedLangs');
var googleImageCrawler = require('../data/googleImageCrawler.js');


module.exports = wordRouter;
function wordRouter(router){
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
        var updateData= {};
        if (req.body.folderId) updateData.folderId = req.body.folderId;
        if (req.body.editword) updateData.word = req.body.editword;
        if (req.body.editmeaning) updateData.meaning = req.body.editmeaning;
        if (req.body.editexample) updateData.example = req.body.editexample;
        if (req.body.editimage) updateData.image = req.body.editimage;

        Words.update({
            userId: req.session.passport.user,
            _id:wordid,
            folderId: req.body.folderId
        }, {
            $set:updateData
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

    router.get("/api/getSuggestedImages/:q", function(req,res){
        var q = encodeURI(req.params.q);
        googleImageCrawler(q).then(function(data){
            //console.log('data(images url): ', data);
            res.json(data);
        });
    });

}