var express = require('express');
var moment = require('moment');
var formidable = require('formidable');
var router = express.Router();
var fs = require('fs');
var config = require('../config');
const rootPath = config.root;

function makeUrl(str) {
    let url = decodeURIComponent(str);
    if (url.indexOf('?') >= 0) {
        url = url.substring(0, url.indexOf('?'));
    }

    if (url.endsWith('/')) {
        url = url.substring(0, url.length - 1);
    }
    return url;
}

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
                    isRecentUpdated: isRecentUpdated(stat.mtime),
                    isRecentCreated: isRecentCreated(stat.birthtime),
                    icon: getIcon(e),
                    isImage: isImage,
                    size: getFileSize(stat.size)
                })
            }
        }
        else if (stat.isDirectory) {
            recursiveSearch(path + '/' + e, searchText, req, res);
        }
    });

    if (path === config.root + (req.query.rootUrl || '')) {
        res.render('search.html', {
            fileArr: recursiveSearchResult,
            searchText: searchText
        });
    }
}

router.post('/__upload', function (req, res, next) {
    let folder = decodeURIComponent(req.query.path);
    var form = new formidable.IncomingForm();
    form.parse(req);
    form.on('fileBegin', function (name, file) {
        file.path = config.root + '/' + folder + '/' + file.name;
    });
    form.on('file', function (name, file) {
        console.log('Uploaded ' + file.name, new Date());
        res.json({name:file.name});
    });
});

router.get('/__search', function (req, res, next) {
    console.log(req.query);
    searchRootUrl = config.root + (req.query.rootUrl || '')
    let searchText = req.query.searchText.toLowerCase();
    recursiveSearchResult = [];
    recursiveSearch(searchRootUrl, searchText, req, res);
});


router.get('/*/', function (req, res, next) {
    let url = makeUrl(req.url);
    const path = rootPath + url;

    fs.lstat(path, (err, stat) => {

        if (err) {
            console.log(err);
            res.sendStatus(500);
        } else {

            if (stat.isDirectory()) {
                fs.readdir(path, (err, files) => {
                    if (err) {
                        res.render('index.html', {
                            useUpload: config.useUpload,
                            useSearch: config.useSearch,
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

                    res.render('index.html', {
                        useUpload: config.useUpload,
                        useSearch: config.useSearch,
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
    return sortList(fileArr, sort);
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
    return sortList(folderArr, sort);
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
}

module.exports = router;
