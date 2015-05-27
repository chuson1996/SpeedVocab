//speedvocab.get('', function(req,res){
//
//});
var Folder = require('../models/folder.js');
var Words = require('../models/word.js');
var unirest = require('unirest');
module.exports = function(app){

    app.get('/', function(req, res, next) {
        res.render('index', { title: 'Express' });
    });

    app.get('/account',function(req,res){
        //if (!req.session.passport.user)
        //    return res.redirect(303,'/unauthorized');
        ////res.type('text/plain').send(req.session.passport.user);
        //var User = require('../models/user.js');
        //User.findOne({_id: req.session.passport.user},function(err,user){
        //    if (err) throw err;
        //    res.render('layout',{title: "Logged in", user: user});
        //});
        res.redirect('/speedvocab');
    });

    app.get('/speedvocab', function(req,res){
        res.render('app');
    });

    app.get('/speedvocab/learn', function(req,res){
        res.render('learn');
    })
    // ------------ Handle POST request -------------
    app.post('/speedvocab/post/addfolder', function(req,res){
        console.log(req.body);
        new Folder({
            userId: req.session.passport.user,
            name: req.body.folderName,
            fromLang: req.body.fromLang,
            toLang: req.body.toLang,
            created: Date()
        }).save();
        res.send('OK');
    });
    app.post('/speedvocab/post/addword', function(req,res){
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
    app.post('/speedvocab/storeTestingWordsToSession', function(req,res){
        console.log(req.body);
        req.session.toTestWords = req.body.toTestWords;
        res.send('OK');
    });

    // ------------- Handle PUT Request ----------------------------
    app.put('/speedvocab/api/editword/:wordid', function(req,res){
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
    app.put('/speedvocab/api/updateNoCorrectAns/:wordid', function(req,res){
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
            Words.update({_id: wordid, userId: req.session.passport.user},{
                $set:{
                    NoWrongAns:updateWor,
                    NoCorrectAns: updateCor
                }
            }, function(err,doc){
                if (err) throw err;
                //console.log(doc);
            });
        });
        res.send('OK');
    });
    app.put('/speedvocab/api/updateNoWrongAns/:wordid', function(req,res){
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
            Words.update({_id: wordid, userId: req.session.passport.user},{
                $set:{
                    NoWrongAns:updateWor,
                    NoCorrectAns: updateCor
                }
            }, function(err,doc){
                if (err) throw err;
                //console.log(doc);
            });
        });
        res.send('OK');
    });

    // ------------------ Handle DELETE Request --------------------------
    app.delete('/speedvocab/api/deleteword/:wordid', function(req,res){
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
    // ------------ Local API -----------------------
    app.get('/speedvocab/api/getfolders', function(req,res){
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
        });
    });
    app.get('/speedvocab/api/getwords', function(req,res){
        if (req.params.SaveToSession===true){
            req.session.openningFolder = req.query.openningFolder;
        }
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
    app.get('/speedvocab/api/toLearnWords', function(req,res){
        var toSend=[];
        Words.find({ userId:req.session.passport.user, _id:{$in: req.session.toTestWords}}).exec().then(function(docs){
            //docs.map(function(doc){
            //    return {
            //        _id: doc._id,
            //        folderId: doc.folderId,
            //        word: doc.word,
            //        meaning: doc.meaning,
            //        example: doc.example,
            //        image: doc.image,
            //        NoCorrectAns: doc.NoCorrectAns
            //    }
            //});
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
    app.get('/speedvocab/api/defineWord/:word', function(req,res){
        // These code snippets use an open-source library. http://unirest.io/nodejs
        unirest.get("https://wordsapiv1.p.mashape.com/words/"+req.params.word)
            .header("X-Mashape-Key", "1XzINqg3Rfmshizwhfrgi54LAaX5p1Aj9Y5jsn6roqcGczBBD4")
            .header("Accept", "application/json")
            .end(function (result) {
                //console.log('result: ',result.body);
                //console.log('status: ',result.status);
                if (result.status !== 200) return res.status(500).send('Not found');
                return res.json(result.body);
            });
    });

}