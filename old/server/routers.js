const Article = require('./controllers/article_controller.js');


module.exports = function(app){
    /*
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
    */
    app.post('/putArticle',Article.put);
    app.post('/getArticle',Article.get);

    app.post('/article',(req,res)=>
    {
        res.setHeader('Access-Control-Allow-Origin','*');
        console.log(req.body);
        console.log(JSON.parse(req.body.data));
        //console.log(req.body.data);
        //console.log(JSON.parse(req.body.data));
        res.send('hello');
        res.end();
    })
}