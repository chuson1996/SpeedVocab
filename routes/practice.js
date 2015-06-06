var express = require('express');
var router = express.Router();
router.get('/', function(req, res, next) {
    res.render('practice/index', { title: 'Practice' });
});
router.get('/template/practice/:id', function(req, res, next) {
    res.render('practice/practice'+req.params.id);
});
module.exports = router;