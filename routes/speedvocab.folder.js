var Folder = require('../models/folder.js');
var Words = require('../models/word.js');
var _ = require('lodash');
var async = require('async');
//var User = require('../models/user.js');

module.exports = folderRouter;

function folderRouter(router){
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
        }).catch(function (err) {
            res.status(501).send(err);
        });
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
    router.delete('/api/deletefolder/:folderId', function(req,res){
        async.series({
            remove_terms_in_folder: function (cb) {
                Words.remove({
                    userId: req.session.passport.user,
                    folderId: req.params.folderId,
                }, function (err) {
                    if (err) return cb(err);
                    return cb(null);
                })
            },
            remove_folder: function (cb) {
                Folder.remove({
                    userId: req.session.passport.user,
                    _id: req.params.folderId
                }, function(err){
                    if(err) return cb(err);
                    return cb(null);
                    //res.status(500).send('Something wrong');
                    //return res.send('OK');
                })
            }
        }, function (errs, results) {
            if (errs) return res.status(500).send(errs);
            return res.send('OK');
        })


    })
}
