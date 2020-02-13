var express = require('express');
var moment = require('moment');
var formidable = require('formidable');
var router = express.Router();
var fs = require('fs');
var rimraf = require("rimraf");
var util = require('../common/util');
var config = require('../config');

var searchRootUrl = '';
var recursiveSearchResult = [];
var recursiveSearch = function (path, searchText, req, res) {
    let files = fs.readdirSync(path);
    files.forEach((e, i) => {
        if (e.indexOf(config.prefixForHidden) >= 0) return;
        let stat = fs.lstatSync(path + '/' + e);
        let isImage = false;
        if (config.previewImage && stat.size <= 1048576) { // show thumb image smaller than 1MB
            let ext = e.split('.').pop().toLowerCase();
            isImage = (ext == 'svg' || ext == 'png' || ext == 'jpg' || ext == 'jpeg' || ext == 'gif');
        }
        if (stat.isFile()) {
            if (e.toLowerCase().indexOf(searchText) >= 0) {
                recursiveSearchResult.push({
                    path: path.replace(config.root, ''),
                    fileName: e,
                    mDate: moment(stat.mtime).format('YYYY-MM-DD HH:mm:ss'),
                    isRecentUpdated: util.isRecentUpdated(stat.mtime),
                    isRecentCreated: util.isRecentCreated(stat.birthtime),
                    icon: util.getIcon(e),
                    isImage: isImage,
                    size: util.getFileSize(stat.size)
                })
            }
        }
        else if (stat.isDirectory) {
            recursiveSearch(path + '/' + e, searchText, req, res);
        }
    });

    if (path === config.root + (req.query.rootUrl || '')) {
        res.render('search.html', util.renderObject({
            fileArr: recursiveSearchResult,
            searchText: searchText
        }));
    }
}

router.post('/upload', function (req, res, next) {
    let folder = decodeURIComponent(req.query.path);
    var form = new formidable.IncomingForm();
    form.maxFileSize = 1024 * 1024 * 1024;
    form.parse(req);
    form.on('fileBegin', function (name, file) {
        file.path = config.root + '/' + folder + '/' + file.name;
    });
    form.on('file', function (name, file) {
        console.log('Uploaded ' + file.name, new Date());
        res.json({ name: file.name });
    });
});

router.get('/search', function (req, res, next) {
    searchRootUrl = config.root + (req.query.rootUrl || '')
    let searchText = req.query.searchText.toLowerCase();
    recursiveSearchResult = [];
    recursiveSearch(searchRootUrl, searchText, req, res);
});

router.post('/newfolder', function (req, res, next) {
    if (!fs.existsSync(config.root + req.body.path + req.body.folderName)) {
        fs.mkdirSync(config.root + req.body.path + req.body.folderName);
        res.json({});
    }else{
        res.json({errorMsg:'이미 폴더가 존재합니다'})
    }
});

router.post('/rename', function (req, res, next) {
    let currentFile = config.root + '/' + req.body.path + '/' + req.body.fileName;
    let newFile = config.root + '/' + req.body.path + '/' + req.body.newFileName;
    if (fs.existsSync(currentFile)) {
        fs.rename(currentFile, newFile, function(e){
            if(e){
                res.json({errorMsg: e.toString()})
            }else{
                res.json({});
            }
        })
    }else{
        res.json({errorMsg:'파일이 존재하지 않습니다'})
    }
});
router.post('/delete', function (req, res, next) {
    let file = config.root + '/' + req.body.path + '/' + req.body.fileName;
    console.log(file);
    let stat = fs.lstatSync(file);
    if(stat.isFile()){
        fs.unlinkSync(file);
        res.json({})
    }else{
        rimraf(file, function (e) { 
            console.log(e); 
            res.json({})
        });
    }
});



module.exports = router;
