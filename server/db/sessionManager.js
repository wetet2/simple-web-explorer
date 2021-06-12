const moment = require('moment');
const mongo = require('./conn/mongo');
const logger = require('../common/logger')();
const requestIp = require('request-ip')
const config = require('../config');
const bowser = require('bowser');

const { COOKIES } = require('../common/enum')


const sessionManager = {
   init: async (uid, req) => {
      let sessions = await mongo.getConn('sessions');
      let ua = bowser.parse(req.headers['user-agent']);
      let data = {
         uid,
         password: req.body.inputPass,
         ip: requestIp.getClientIp(req).replace('::ffff:', ''),
         userAgent: ua,
         inTime: moment().format(),
         updateTime: moment().format()
      }
      return await sessions.updateOne(
         { uid },
         {
            $set: data
         },
         { upsert: true }
      )
   },

   get: async (uid) => {
      let sessions = await mongo.getConn('sessions');
      return await sessions.findOne({ uid, isDeleted: { $ne: true } });
   },
   set: async (uid, updateTime) => {
      let sessions = await mongo.getConn('sessions');
      await sessions.updateOne(
         { uid }, { $set: { updateTime } }
      )
   },
   isValid: async (req) => {
      let uid = req.cookies[COOKIES.SESSION_ID]
      if (!uid || uid == '') return false;
      let clientIp = requestIp.getClientIp(req);
      let sessionInfo = await sessionManager.get(uid);
      if (sessionInfo) {
         let checkResult = await sessionManager.checkExpire(uid, sessionInfo.updateTime);
         if(checkResult){
            sessionInfo.isAdmin = config.adminPassList.includes(sessionInfo.password);
            return sessionInfo;
         }
      }
      else {
         logger.i('uid invalid: ', uid, clientIp)
      }
      return;
   },
   checkExpire: async (uid, dateTime) => {
      if (moment(dateTime).isAfter(moment().subtract(config.sessionExpireMinutes, 'm'))) {
         await sessionManager.set(uid, moment().format())
         return true;
      }
      return false;
   },

   trace: async (req, params = {}) => {
      let uid = req.cookies[COOKIES.SESSION_ID]
      let time = moment().format();
      let sessionInfo = await sessionManager.get(uid);
      if (sessionInfo) {
         let actions = await mongo.getConn('actions');
         await actions.insertOne({ uid, time, ...params })
      }
   }

}

module.exports = sessionManager;
