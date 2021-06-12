const express = require('express');
const router = express.Router();
const asyncHandler = require('../common/asyncHandler');
const moment = require('moment');
const mongo = require('../db/conn/mongo');
const config = require('../config');
const util = require('../common/util');
const fs = require('fs');
const path = require('path');
const sessionManager = require('../db/sessionManager');

router.post('/repo/list', asyncHandler(async (req, res, next) => {
   let dir = req.body.dir || '/';
   let dirPath = path.join(config.rootStorage, dir);
   try {
      let dirStat = fs.lstatSync(dirPath);
      if (dirStat.isDirectory()) {
         let files = fs.readdirSync(dirPath);
         let fileArr = [];
         let folderArr = [];

         files.forEach(fileName => {
            if(config.useLogin === true && !req.sessionInfo.isAdmin){
               if (fileName.startsWith(config.prefixForHidden)) return;
            }

            let stat = fs.lstatSync(path.resolve(dirPath, fileName))
            if (stat.isFile()) {

               fileArr.push({
                  type: 'file',
                  name: fileName,
                  updateTime: moment(stat.mtime).format('YYYY-MM-DD HH:mm:ss'),
                  isRecentUpdated: util.isRecentUpdated(stat.mtime),
                  isRecentCreated: util.isRecentCreated(stat.birthtime),
                  icon: util.getIcon(fileName),
                  isImage: util.isImage(fileName),
                  size: util.getFileSize(stat.size)
               })

            }
            else if (stat.isDirectory()) {
               folderArr.push({
                  type: 'folder',
                  name: fileName,
                  updateTime: moment(stat.mtime).format('YYYY-MM-DD HH:mm:ss')
               });
            }
         });

         res.json({ fileArr, folderArr });
      }
      else {
         res.json({ errorMsg: '폴더가 없습니다', redirect: '/' });
      }
   }
   catch (err) {
      console.log(err);
      res.json({ errorMsg: '폴더가 없습니다', redirect: '/' });
   }

}));


router.post('/trace', async (req, res, next) => {
   if(config.useLogin === true){
      await sessionManager.trace(req, req.body.params || {});;
   }
   res.sendStatus(200);
});

router.post('/sessions/list', async (req, res, next) => {
   let chkIncludeDel = req.body.chkIncludeDel;
   let match;
   if (chkIncludeDel) {
      match = {};
   } else {
      match = { isDeleted: { $ne: true } }
   }
   let sessions = await mongo.getConn('sessions');
   let result = await sessions.aggregate([
      {
         $limit: 1000
      },
      {
         $match: match
      },
      {
         $lookup: {
            from: 'actions',
            let: { sid: '$uid' },
            pipeline: [
               {
                  $match: {
                     $expr: {
                        $and: [
                           { $eq: ["$uid", "$$sid"] },
                        ]
                     }
                  }
               },
            ],
            as: 'actions'
         }
      },
      {
         $project: {
            uid: 1, password: 1, ip: 1, userAgent: 1,
            inTime: 1, updateTime: 1, userAgent: 1, isDeleted: 1,
            viewCount: { $size: "$actions" }
         }
      },
      {
         $sort: {
            inTime: -1
         },
      },
   ]).toArray();
   res.json(result);
});

router.post('/sessions/detail', async (req, res, next) => {
   let actions = await mongo.getConn('actions');
   let result = await actions.find({ uid: req.body.uid }).sort({ time: -1 }).toArray();
   res.json(result);
});

router.post('/sessions/delete', async (req, res, next) => {
   let chkIncludeDel = req.body.chkIncludeDel;
   let sessions = await mongo.getConn('sessions');
   

   if (!chkIncludeDel) {
      let result = await sessions.updateOne(
         { uid: req.body.uid },
         {
            $set: {
               isDeleted: true
            }
         }
      );
      res.json(result.result);
   }
   else {
      let actions = await mongo.getConn('actions');

      await actions.deleteOne({ uid: req.body.uid });
      let result = await sessions.deleteOne({ uid: req.body.uid });
      res.json(result.result);
   } 
});

// Api Not Found
router.use((req, res, next) => {
   let err = new Error(`${req.url} Not Found`);
   err.status = 404;
   next(err);
})

module.exports = router;
