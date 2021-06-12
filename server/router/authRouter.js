const express = require('express');
const router = express.Router();
const sessionManager = require('../db/sessionManager');
const mongo = require('../db/conn/mongo');
const config = require('../config');
const path = require('path');
const asyncHandler = require('../common/asyncHandler');
const { COOKIES } = require('../common/enum');
const uuid = require('uuid').v4;

router.post('/cert', (req, res, next) => {
   res.json({ type: 'post', body: req.body, query: req.query });
})
router.get('/cert', (req, res, next) => {
   res.json({ type: 'get', body: req.body, query: req.query });
})

router.get('/login', async (req, res, next) => {
   if (await sessionManager.isValid(req)) {
      res.redirect('/');
   } else {
      res.clearCookie(COOKIES.SESSION_ID);
      res.sendFile(path.resolve(__dirname, '../../client_dist/login.html'));
   }
})

router.get('/logout', (req, res, next) => {
   res.clearCookie(COOKIES.SESSION_ID);
   res.redirect('/auth/login');
});

router.post('/login', asyncHandler(async (req, res, next) => {
   let result = config.loginPassList.includes(req.body.inputPass)
   if (result) {
      let uid = uuid();
      await sessionManager.init(uid, req);
      res.cookie(COOKIES.SESSION_ID, uid);
      result = { status: 1, redirect: req.body.redirect }
   }
   else {
      result = { status: 2, msg: '암호가 틀립니다' };
   }
   res.json(result);
}));

router.post('/get', asyncHandler(async (req, res, next) => {
   if (config.useLogin) {
      let uid = req.cookies[COOKIES.SESSION_ID]
      let sessions = await mongo.getConn('sessions');
      let sessionInfo = await sessions.findOne({ uid });
      res.json({ admin: config.adminPassList.includes(sessionInfo.password) });
   } else {
      res.json({ admin: true });
   }
}))

function tryLogin(req) {
   let ldapClient = ldap.createClient({ url: config.ldapConfig.url });
   return new Promise((resolve, reject) => {
      let a = req.body.inputPass;
      ldapClient.bind(req.body.inputId + config.ldapConfig.userPostfix, (req.body.inputPass || ''), (err) => {
         ldapClient.unbind();
         if (err) {
            console.log(err);
            reject('아이디 또는 암호를 잘못 입력하였습니다');
         } else {
            resolve();
         }
      })
      ldapClient.on('error', (err) => {
         reject(err.message);
      })
   })
      .then(async (result) => {
         let users = await mongo.getConn('users');
         let foundUser = await users.findOne({ ubwareId: req.body.inputId });
         if (!foundUser) {
            return { msg: `등록되지 않은 사용자입니다.`, status: 2 }
         } else {
            return { msg: '로그인완료', status: 1 };

         }
      }, error => {
         return { msg: error, status: 2 }
      })
}


module.exports = router;




