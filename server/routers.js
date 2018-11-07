const express = require('express');

module.exports = function(app){
    app.get('/',(req,res) =>
    {
        res.send('hello world');
        console.log('用户访问');
    });
    app.get('/editor',(req,res)=>
    {
        res.setHeader('Access-Control-Allow-Origin','*');
        res.send('test');
    })
    app.post('/editor',(req,res)=>
    {
        res.setHeader('Access-Control-Allow-Origin','*');
        console.log(JSON.parse(req.body.data));
        res.send('hello');
        res.end();
    })
}