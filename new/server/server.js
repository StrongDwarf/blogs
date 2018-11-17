var express = require('express');
var bodyParser = require('body-parser');
//var cookieParser = require('cookie-parser');
//var expressSession = require('express-session');
//连接数据库
var mongoose = require('mongoose');
var conn = mongoose.connect('mongodb://localhost/blogs');

var app = express();
var http = require('http').Server(app);

//设置bodyParse能解析的数据为无限
app.use(bodyParser.json({'limit':'1000000kb'}));
app.use(bodyParser());

/*
app.use(cookieParser());
app.use(expressSession({
	secret:'SECRET',
	cookie:{maxAge:60*60*1000},
}));
*/
//导入路由模块和websocket模块
require('./routers')(app);
http.listen(8083);
console.log('server start port 8083');
