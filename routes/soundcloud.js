/**
 * Created by chuso_000 on 26/5/2015.
 */
var express = require('express');
var router = express.Router();
router.get('/', function(req, res, next) {
    res.render('globalear/index', { title: 'SoundCloud App' });
});
router.get('/template/main', function(req,res){
    res.render('globalear/main');
});
router.get('/auth/callback', function(req,res){
    res.render('globalear/auth-callback');
})
module.exports = router;