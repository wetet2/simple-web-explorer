var express = require('express');
var moment = require('moment');
var router = express.Router();
var fs = require('fs');
var config = require('../config');

const rootPath = config.root;

router.get('/*/', function (req, res, next) {
    let url = decodeURIComponent(req.url);
    if (url.indexOf('?') >= 0) {
        url = url.substring(0, url.indexOf('?'));
    }

    if (url.endsWith('/')) {
        url = url.substring(0, url.length - 1);
    }
    const path = rootPath + url;

    fs.lstat(path, (err, stat) => {

        if (err) {
            console.log(err);
            res.sendStatus(500);
        } else {

            if (stat.isDirectory()) {
                fs.readdir(path, (err, files) => {
                    if (err) {
                        res.render('index', {
                            folderArr: [],
                            fileArr: [],
                            path: url,
                            prevPath: '',
                        });
                        return;
                    }

                    var fileArr = getFiles(path, files, req.query.sort);
                    var folderArr = getFolders(path, files, req.query.sort);

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
            else if (stat.isFile()) {
                // res.type('application/octet-stream');
                res.sendFile(path);
            } else {
                res.statusMessage = 'Neither file nor directory';
                res.send(500);
            }
        }

    });


});

var iconList =
    ['avi', 'css', 'csv', 'doc', 'docx'
        , 'html', 'jpg', 'js', 'json', 'mp3'
        , 'mp4', 'pdf', 'png', 'ppt', 'pptx'
        , 'psd', 'scss', 'txt', 'unknown', 'xls'
        , 'xlsx', 'xml', 'zip', '7z', 'alz'];

function getIcon(name) {
    var ext = name.split('.')[name.split('.').length - 1];
    if (iconList.indexOf(ext) > -1) return ext;
    else return 'unknown';
}
function getFileSize(bytes) {
    if (bytes > 1048576) {
        return parseInt(bytes / 1048576) + ' MB';
    } else if (bytes > 1024) {
        return parseInt(bytes / 1024) + ' KB';
    } else {
        return '1 KB';
    }
}
function getFiles(path, arr, sort) {
    let fileArr = [];
    arr.forEach((e, i) => {
        if (e.indexOf(config.prefixForHidden) >= 0) return;
        let stat = fs.lstatSync(path + '/' + e);
        let isImage = false;
        if (config.previewImage && stat.size <= 1048576) { // show thumb image smaller than 1MB
            let ext = e.split('.').pop().toLowerCase();
            isImage = (ext == 'svg' || ext == 'png' || ext == 'jpg' || ext == 'jpeg' || ext == 'gif');
        }
        if (stat.isFile()) {
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
    return sortList(fileArr, sort || 1);
}
function isRecentUpdated(date) {
    return moment(date).isSame(moment(new Date()), "day")
}
function isRecentCreated(date) {
    return moment(date).isSameOrAfter(moment(new Date()), "day")
}
function getFolders(path, arr, sort) {
    let folderArr = [];
    arr.forEach((e, i) => {
        if (e.indexOf(config.prefixForHidden) >= 0) return;
        let stat = fs.lstatSync(path + '/' + e);
        if (stat.isDirectory()) {
            folderArr.push({
                fileName: e,
                mDate: moment(stat.mtime).format('YYYY-MM-DD HH:mm:ss')
            });
        }
    })
    return sortList(folderArr, sort || 1);
}
function sortList(arr, sortType) {
    switch (parseInt(sortType)) {
        case 1: // name desc
            return arr.sort((val2, val1) => {
                if (val2.fileName.toLowerCase() < val1.fileName.toLowerCase()) return -1;
                else if (val2.fileName.toLowerCase() > val1.fileName.toLowerCase()) return 1;
                else return 0;
            })
        case 2: // name asc
            return arr.sort((val1, val2) => {
                if (val2.fileName.toLowerCase() < val1.fileName.toLowerCase()) return -1;
                else if (val2.fileName.toLowerCase() > val1.fileName.toLowerCase()) return 1;
                else return 0;
            })
        case 3: // date desc
            return arr.sort((val2, val1) => {
                if (val2.mDate < val1.mDate) return -1;
                else if (val2.mDate > val1.mDate) return 1;
                else return 0;
            })
        case 4: // date asc
            return arr.sort((val1, val2) => {
                if (val2.mDate < val1.mDate) return -1;
                else if (val2.mDate > val1.mDate) return 1;
                else return 0;
            })
        default:
            return arr;

    }
    

    return
}

module.exports = router;
