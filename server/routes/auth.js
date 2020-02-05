var express = require('express');
var router = express.Router();
var sessionManager = require('../common/sessionManager');
const config = require('../config');

router.post('/login', function (req, res, next) {
    let success = config.loginPassList.some(e => e === req.body.pw)
    if(success){
        sessionManager.add(req.session.id);
        res.json({result: true})
    }else{
        res.json({result: false})
    }
});
router.post('/logout', function (req, res, next) {
    sessionManager.remove(req.session.id);
});

module.exports = router;