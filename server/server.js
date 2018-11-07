const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
//const mongoose = require('mongoose');
//const conn = mongoose.connect('mongodb://localhost/blogs');
const app = express();
const http = require('http').Server(app);

app.use(bodyParser());
app.use(cookieParser());
app.use(expressSession({
    secret:'SECRET',
    cookie:{maxAge:60*60*1000},
}));
//导入路由模块
require('./routers')(app);
http.listen(8080);
console.log('server START PORT 8080');
