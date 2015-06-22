
var Folder = require('../models/folder.js');
var Words = require('../models/word.js');
var unirest = require('unirest');
var rp = require('request-promise');
var express = require('express');
var router = express.Router();







router.get('', function(req,res){
    //console.log(req.session.detail);
    res.render('speedvocab');
});
router.get('/template/app', function(req,res){
    console.log(req.session.detail);
    if (req.session.detail)
        return res.render('app2', req.session.detail);
    return res.send('Out of session!');
});

router.get('/template/learn', function(req,res){
    res.render('learn');
})
// ------------ Handle POST request -------------
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
router.post('/post/addword', function(req,res){
    //console.log(req.body);
    //Words.update({
    //    userId: req.session.passport.user,
    //    folderId: req.body.folderId,
    //    word:req.body.addword
    //}, {
    //    $set:{
    //        userId: req.session.passport.user,
    //        folderId: req.body.folderId,
    //        word:req.body.addword,
    //        meaning: req.body.addmeaning,
    //        example: req.body.addexample,
    //        image: req.body.addimage,
    //        NoCorrectAns: 0,
    //        NoWrongAns: 0,
    //        createdAt: Date()
    //    }
    //
    //},{
    //    upsert: true
    //}, function(err, doc){
    //    if (err) throw err;
    //    console.log('The doc: ',doc);
    //});
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
        if (err) throw err;
        delete newWord.userId;
        res.json(newWord);
    });


});


// ------------- Handle PUT Request ----------------------------
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
    console.log(wordid);

    Words.findOne({_id: wordid}).select('NoCorrectAns NoWrongAns').then(function(doc){
        console.log(doc);
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
    console.log(wordid);

    Words.findOne({_id: wordid}).select('NoCorrectAns NoWrongAns').then(function(doc){
        console.log(doc);
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

// ------------------ Handle DELETE Request --------------------------
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
router.delete('/api/deletefolder/:folderid', function(req,res){
    Folder.remove({
        userId: req.session.passport.user,
        _id: req.params.folderid
    }, function(err){
        if(err) return res.status(500).send('Something wrong');
        return res.send('OK');
    })
})
// ------------ Local API -----------------------
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
router.get('/api/getwords', function(req,res){
    console.log(req.session.passport.user, req.query.openningFolder);
    var toSend=[];
    Words.find({userId: req.session.passport.user, folderId: req.query.openningFolder}).then(function(words){
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
            o.wordVoice="http://vaas.acapela-group.com/Services/Streamer.ogg?req_voice=sharon22k&req_text="+term.word.replace(/ /g, '+')+"&cl_login=EVAL_VAAS&cl_app=EVAL_1187628&cl_pwd=2anoa8wk";
            o.meaningVoice="http://vaas.acapela-group.com/Services/Streamer.ogg?req_voice=sharon22k&req_text="+term.meaning.replace(/ /g, '+')+"&cl_login=EVAL_VAAS&cl_app=EVAL_1187628&cl_pwd=2anoa8wk";
            o.createdAt = term.createdAt;
            //console.log('after: ',o);
            toSend.push(o);
        });
        //console.log(toSend);
        //words.forEach(function(word){
        //    console.log('wordVoice', word.wordVoice);
        //})
        res.json(toSend);
    });
});
var voiceList = require('../data/acapela-vaas/voice-list.js');
router.get('/api/toLearnWords', function(req,res){
    var toSend=[];
    Words.find({ userId:req.session.passport.user, _id:{$in: req.session.toTestWords}}).exec().then(function(docs){
        var folderInfo;
        Folder.findOne({userId:req.session.passport.user, _id: docs[0].folderId}).then(function(folder){
            //console.log(folder);
            //console.log(voiceList);
            folderInfo=folder;
            docs.forEach(function(term){
                var o={};
                o._id=term._id;
                o.folderId=term.folderId;
                o.word=term.word;
                o.meaning=term.meaning;
                o.example=term.example;
                o.image=term.image;
                o.NoCorrectAns=term.NoCorrectAns;
                o.NoWrongAns=term.NoWrongAns;
                o.wordVoice="http://vaas.acapela-group.com/Services/Streamer.ogg?req_voice="+voiceList[folderInfo.fromLang]+"&req_text="+term.word.replace(/ /g, '+')+"&cl_login=EVAL_VAAS&cl_app=EVAL_1187628&cl_pwd=2anoa8wk";
                o.meaningVoice="http://vaas.acapela-group.com/Services/Streamer.ogg?req_voice="+voiceList[folderInfo.toLang]+"&req_text="+term.meaning.replace(/ /g, '+')+"&cl_login=EVAL_VAAS&cl_app=EVAL_1187628&cl_pwd=2anoa8wk";
                //console.log('after: ',o);
                toSend.push(o);
            });
            res.json(toSend);
        });

    });
    //res.json(req.session.toTestWords);
});
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
    if (from=='en' && to=='en'){
        unirest.get("https://wordsapiv1.p.mashape.com/words/"+req.params.word)
            .header("X-Mashape-Key", "1XzINqg3Rfmshizwhfrgi54LAaX5p1Aj9Y5jsn6roqcGczBBD4")
            .header("Accept", "application/json")
            .end(function (result) {
                //console.log('result: ',result.body);
                //console.log('status: ',result.status);
                if (result.status !== 200) return res.status(500).send('Not found');
                return res.json(result.body);
            });
    }else{
        rp('https://dictionary.yandex.net/api/v1/dicservice.json/lookup?key=dict.1.1.20150209T212534Z.94adfd8a495e3628.73c2afbdd079b4a53fdbcc4b4c9578b1905112bf&lang='+from+'-'+to+'&text='+req.params.word+'')
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
    googleImageCrawler(req.params.q).then(function(data){
        //console.log('data(images url): ', data);
        res.json(data);
    });
});

module.exports = router;