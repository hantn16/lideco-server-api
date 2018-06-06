var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
    res.render('index',{title: 'Lideco Hạ Long'});
});

module.exports = router;
