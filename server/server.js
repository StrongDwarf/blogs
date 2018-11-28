var express = require('express');
var bodyParser = require('body-parser');
//var cookieParser = require('cookie-parser');
//var expressSession = require('express-session');
//连接数据库
var mongoose = require('mongoose');
var conn = mongoose.connect('mongodb://localhost/blogsTest');

var app = express();
var http = require('http').Server(app);

//自定义一个CORS中间件
var allowCrossDomain = function (req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');//自定义中间件，设置跨域需要的响应头。
	next();
};

//设置bodyParse能解析的数据为无限
app.use(allowCrossDomain);
app.use(bodyParser.json({'limit':'100000000000kb'}));
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
