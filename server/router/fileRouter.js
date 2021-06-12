const express = require('express');
const router = express.Router();
const asyncHandler = require('../common/asyncHandler');
const config = require('../config');
const moment = require('moment');
const util = require('../common/util');
const fs = require('fs');
const fsExtra = require('fs-extra');
const nodePath = require('path');
const formidable = require('formidable');
const rimraf = require('rimraf');

router.post('/delete', asyncHandler(async (req, res, next) => {
   let { dir, fileName } = req.body;
   let filePath = nodePath.join(config.rootStorage, dir, fileName);

   try {
      let stat = fs.lstatSync(filePath);
      if (stat.isFile()) {
         fs.unlinkSync(filePath);
         res.json({ ok: true });
         console.log('file deleted:', filePath, 'by uid: ', req.sessionInfo.uid);
      }
      else {
         rimraf(filePath, () => {
            res.json({ ok: true });
            console.log('folder deleted:', filePath, 'by uid: ', req.sessionInfo.uid);
         })
      }

   } catch (err) {
      console.log(err);
      res.json({ ok: false });
   }
}));

router.post('/upload', (req, res, next) => {
   let folder = decodeURIComponent(req.query.dir);
   try {
      var form = new formidable.IncomingForm();
      form.maxFileSize = 1024 * 1024 * 1024 * 8;
      form.parse(req);
      form.on('fileBegin', function (name, file) {
         file.path = nodePath.join(config.rootStorage, folder, file.name).normalize('NFC');
         let exists = fs.existsSync(file.path);
         let fileIdx = 1;
         while (exists) {
            file.path = nodePath.join(config.rootStorage, folder, makeUniqueFileName(file.name, fileIdx)).normalize('NFC');
            exists = fs.existsSync(file.path);
            fileIdx++;
         }
      });

      let uploadedFiles = [];
      form.on('file', function (name, file) {
         console.log('Uploaded', file.path, new Date());
         uploadedFiles.push(file.name);
      });

      form.once('end', () => {
         res.json({
            uploaded: uploadedFiles.length,
            files: uploadedFiles
         });
      })

   }
   catch (err) {
      console.error(err);
   }
});

router.post('/rename', (req, res, next) => {
   let { dir, fileName, newName } = req.body;
   let filePath = nodePath.join(config.rootStorage, dir, fileName);
   let newFilePath = nodePath.join(config.rootStorage, dir, newName);

   try {
      fs.renameSync(filePath, newFilePath)
      console.log('renamed:', filePath + ' ---> ' + newName);
      res.json({ ok: true });
   } catch (err) {
      console.log(err);
      res.json({ ok: false });
   }

});

router.post('/newfolder', (req, res, next) => {
   let { dir, newName } = req.body;
   let newPath = nodePath.join(config.rootStorage, dir, newName);
   if (!fs.existsSync(newPath)) {
      fs.mkdirSync(newPath);
      res.json({ ok: true });
   }
   else {
      res.json({
         errorMsg: '이미 폴더가 존재합니다'
      })
   }
});

router.post('/move', (req, res, next) => {
   const { dir, srcName, targetFolder } = req.body;

   if (dir === '/' && targetFolder === '..') {
      res.json({ errorMsg: '이동할 수 없습니다' });
      return;
   }

   let srcPath = nodePath.join(config.rootStorage, dir, srcName);
   let targetPath = nodePath.join(config.rootStorage, dir, targetFolder, srcName);

   if (srcPath === targetPath) {
      res.json({ ok: 0 });
      return;
   }

   fsExtra.move(srcPath, targetPath, (err) => {
      if (err) {
         console.error(err);
         res.json({ errorMsg: 'failed to move files' })
      }
      else {
         res.json({ ok: 1 })
      }
   })
});


router.post('/read', (req, res, next) => {
   const { filePath } = req.body;
   let srcPath = nodePath.join(config.rootStorage, filePath);
   fs.readFile(srcPath, function (err, data) {
      res.json({ contents: data.toString() });
   });
});



let recursiveSearchResult = [];
router.post('/search', (req, res, next) => {
   let { dir, text } = req.body;
   recursiveSearchResult = [];
   recursiveSearch(dir, text)
   res.json({ searchList: recursiveSearchResult });
})

function recursiveSearch(dir, searchText) {
   let path = nodePath.join(config.rootStorage, dir);
   let files = fs.readdirSync(path);
   files.forEach((fileName) => {
      if (fileName.startsWith(config.prefixForHidden)) return;
      if (config.searchExclude.includes(fileName)) return;

      let stat = fs.lstatSync(nodePath.join(path, fileName));
      if (stat.isFile()) {
         if (fileName.toLowerCase().indexOf(searchText) >= 0) {
            recursiveSearchResult.push({
               dir: dir.replace(/\\/g, '/'),
               name: fileName,
               mDate: moment(stat.mtime).format('YYYY-MM-DD HH:mm:ss'),
               isRecentUpdated: util.isRecentUpdated(stat.mtime),
               isRecentCreated: util.isRecentCreated(stat.birthtime),
               icon: util.getIcon(fileName),
               size: util.getFileSize(stat.size)
            })
         }
      } else if (stat.isDirectory) {
         recursiveSearch(nodePath.join(dir, fileName), searchText);
      }
   });

   // if (path === rootPath + (rootUrl == '/' ? '' : rootUrl)) {
   //    res.render('search', util.renderObject({
   //       fileArr: recursiveSearchResult,
   //       searchText: searchText
   //    }));
   // }
}

function makeUniqueFileName(name, idx) {
   let nameSplit = name.split('.');
   if (nameSplit.length === 1) return nameSplit[0] + `(${idx})`;
   else {
      nameSplit[nameSplit.length - 2] = nameSplit[nameSplit.length - 2] + `(${idx})`
      return nameSplit.join('.');
   }
}


module.exports = router;
