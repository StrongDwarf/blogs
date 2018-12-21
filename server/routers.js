//文章
const Article = require('./controllers/article_controller.js');
//草稿
const Draft = require('./controllers/draft_controller.js');
//标签
const TagClassify = require('./controllers/tagClassify_controller.js');
const TimeClassify = require('./controllers/timeClassify_controller.js');
const express = require('express');
const fs = require('fs');


module.exports = function (app) {

    app.get('/test', (req, res) => {
        console.log(req.body);
        res.json({
            'name':'xiaobaicai',
            'age':12
        });
        res.end();
    });
    app.get('/testjson', (req, res) => {
        console.log(req.body);
        res.json({
            'name': 'xiaobaicai',
            'type': 'get',
            'age': '123'
        }).end()
    });
    app.post('/test', (req, res) => {
        console.log(req.body);
        res.json({
            'name': 'xiaobaicai',
            'type': 'post',
            'age': '123'
        })
    });

    app.get('/index', function (req, res) {
        res.sendFile(__dirname + "/" + "test.html");
    })

    app.post('/upload', function (req, res) {

        console.log(req.files[0]);  // 上传的文件信息

        var des_file = __dirname + "/public/uploads/" + req.files[0].originalname;
        fs.readFile(req.files[0].path, function (err, data) {
            fs.writeFile(des_file, data, function (err) {
                if (err) {
                    console.log(err);
                } else {
                    response = {
                        message: 'File uploaded successfully',
                        filename: req.files[0].originalname
                    };
                }
                console.log(response);
                res.end(JSON.stringify(response));
            });
        });
    })

    app.use('/public', express.static('public'));

    app.post('/putArticle', Article.putArticle);
    app.post('/getArticle', Article.getArticle);
    app.post('/getArticleList', Article.getArticleList);
    app.post('/updateArticle', Article.updateArticle);
    app.post('/removeArticle', Article.removeArticle);

    app.post('/getTimeClassify', TimeClassify.getTimeClassify);
    app.post('/getTagClassify', TagClassify.getTagClassify);

    app.post('/putDraft', Draft.putDraft);
    app.post('/getDraft', Draft.getDraft);
    app.post('/getDraftList', Draft.getDraftList);
    app.post('/convertArticle', Draft.convertArticle);

    app.post('/getTags', TagClassify.getTags);
}

