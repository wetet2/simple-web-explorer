var express = require('express');
var moment = require('moment');
var router = express.Router();
var fs = require('fs');
var config = require('../config');

const rootPath = config.root;

/* GET home page. */
router.get('/*/', function(req, res, next) {

    let url = decodeURIComponent(req.url);
    if(url.indexOf('?') >= 0){
        url = url.substring(0, url.indexOf('?'));
    }

    if(url.endsWith('/')){
        url = url.substring(0, url.length - 1);
    }
    const path = rootPath + url;



    fs.lstat(path, (err, stat) => {

        if(err){
            console.log(err);
            res.sendStatus(500);
        }else{

            if(stat.isDirectory()){
                fs.readdir(path, (err, files) => {
                    if(err){
                        res.render('index', {
                            folderArr: [],
                            fileArr : [],
                            path: url,
                            prevPath: '',
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
                        prevPath: pathArr.join('/'),

                    });

                });
            }
            else if(stat.isFile()){
                // res.type('application/octet-stream');
                res.sendFile(path);
            }else{
                res.statusMessage = 'Neither file nor directory';
                res.send(500);
            }
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
        let isImage = false;
        if(config.previewImage && stat.size <= 1048576){ // show thumb image smaller than 1MB
            let ext = e.split('.').pop().toLowerCase();
            isImage = (ext == 'svg' || ext == 'png' || ext == 'jpg' || ext == 'jpeg' || ext == 'gif');
        }
        if(stat.isFile()){
            fileArr.push({
                fileName: e,
                mDate: moment(stat.mtime).format('YYYY-MM-DD HH:mm:ss'),
                isRecentUpdated: isRecentUpdated(stat.mtime),
                isRecentCreated: isRecentCreated(stat.birthtime),
                icon: getIcon(e),
                isImage: isImage,
                size: getFileSize(stat.size)
            })
        }
    })
    return fileArr;
}
function isRecentUpdated(date){
    return moment(date).isSame(moment(new Date()), "day")
}
function isRecentCreated(date){
    return moment(date).isSameOrAfter(moment(new Date()), "day")
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
