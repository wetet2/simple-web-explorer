var express = require('express');
var router = express.Router();
var fs = require('fs');
var config = require('../config');
var util = require('../common/util');
const rootPath = process.nodeArgs.root || config.root;

router.get('/*/', function (req, res, next) {
    let url = util.makeUrl(req.url);
    const path = rootPath + url;

    fs.lstat(path, (err, stat) => {

        if (err) {
            console.log(err);
            res.sendStatus(500);
        } else {

            if (stat.isDirectory()) {
                fs.readdir(path, (err, files) => {
                    if (err) {
                        res.render('index.html', util.renderObject({
                            isAdmin: req.isAdmin,
                            folderArr: [],
                            fileArr: [],
                            path: url,
                            prevPath: '',
                        }));

                        return;
                    }

                    var fileArr = util.getFiles(path, files, req.query.sort);
                    var folderArr = util.getFolders(path, files, req.query.sort);

                    var pathArr = url.split('/');
                    var pathCount = pathArr.length;
                    pathArr = pathArr.filter((e, i) => {
                        return i !== pathCount - 1;
                    })

                    res.render('index.html', util.renderObject({
                        isAdmin: req.isAdmin,
                        folderArr,
                        fileArr,
                        path: url,
                        prevPath: pathArr.join('/'),
                    }));

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


module.exports = router;
