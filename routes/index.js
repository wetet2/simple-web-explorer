var express = require('express');
var moment = require('moment');
var router = express.Router();
var fs = require('fs');

const rootPath = require('path').dirname(require.main.filename);
const outputPath = rootPath + '/output'

/* GET home page. */
router.get('/*/', function(req, res, next) {

    let url = decodeURIComponent(req.url);
    const path = outputPath + url;

    fs.lstat(path, (err, stat) => {

        if(err){
            console.log(err);
            return;
        }

        if(stat.isDirectory()){
            fs.readdir(path, (err, files) => {
                console.log('폴더임');
                if(err){
                    res.render('index', {
                        folderArr: [],
                        fileArr : [],
                        path: url,
                        prevPath: ''
                    });
                    return;
                }

                //파일과 폴더 분리
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
            console.log('파일임');
            res.sendfile(path);

        }


    });


});

var iconList =
    ['avi','css','csv','doc','docx'
    ,'html','jpg','js','json','mp3'
    ,'mp4','pdf','png','ppt','pptx'
    ,'psd','scss','txt','unknown','xls'
    ,'xlsx','xml','zip','7z','alz']
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
                isRecent: moment(stat.mtime).isSame(new Date(), "day"),
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
