var express = require('express');
var moment = require('moment');
var router = express.Router();
var fs = require('fs');
var config = require('../config');

const rootPath = config.root;

/* GET home page. */
router.get('/*/', function(req, res, next) {

    let url = decodeURIComponent(req.url);
    if(url.endsWith('/')){
        url = url.substring(0, url.length - 1);
    }
    const path = rootPath + url;

    fs.lstat(path, (err, stat) => {

        if(err){
            console.log(err);
            return;
        }

        if(stat.isDirectory()){
            fs.readdir(path, (err, files) => {
                if(err){
                    res.render('index', {
                        folderArr: [],
                        fileArr : [],
                        path: url,
                        prevPath: ''
                    });
                    return;
                }

                var fileArr = getFiles(path, files);
                var folderArr = getFolders(path, files);

                var pathArr = url.split('/');
                var pathCount = pathArr.length;
                pathArr = pathArr.filter((e, i) => {
                    return i !== pathCount - 1;
                })

                res.render('index', {
                    folderArr,
                    fileArr,
                    path: url,
                    prevPath: pathArr.join('/')
                });

            });
        }
        else if(stat.isFile()){
            res.sendFile(path);
        }

    });


});

var iconList =
    ['avi','css','csv','doc','docx'
    ,'html','jpg','js','json','mp3'
    ,'mp4','pdf','png','ppt','pptx'
    ,'psd','scss','txt','unknown','xls'
    ,'xlsx','xml','zip','7z','alz'];

function getIcon(name){
    var ext = name.split('.')[name.split('.').length - 1];
    if(iconList.indexOf(ext) > -1) return ext;
    else return 'unknown';
}
function getFileSize(bytes){
    if(bytes > 1048576){
        return parseInt(bytes / 1048576) + ' MB';
    }else if(bytes > 1024){
        return parseInt(bytes/1024) + ' KB';
    }else{
        return '1 KB';
    }
}
function getFiles(path, arr){
    let fileArr = [];
    arr.forEach((e,i) => {
        let stat = fs.lstatSync(path + '/' + e);

        if(stat.isFile()){
            fileArr.push({
                fileName: e,
                mDate: moment(stat.mtime).format('YYYY-MM-DD HH:mm:ss'),
                isRecentUpdated: moment(stat.mtime).isSame(new Date(), "day"),
                isRecentCreated: moment(stat.birthtime).isSame(new Date(), "day"),
                icon: getIcon(e),
                size: getFileSize(stat.size)
            })
        }
    })
    return fileArr;
}
function getFolders(path, arr){
    let folderArr = [];
    arr.forEach((e,i) => {
        if(fs.lstatSync(path + '/' + e).isDirectory()){
            folderArr.push(e);
        }
    })

    return folderArr;
}

module.exports = router;
