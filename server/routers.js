//文章
const Article   = require('./controllers/article_controller.js');
//草稿
const Draft     = require('./controllers/draft_controller.js');



module.exports = function(app){
    
    app.get('/test',(req,res) =>
    {
        console.log(req.body);
        res.send('xiaobaicai');
        res.end();
    });

    app.post('/putArticle',Article.putArticle);
    app.post('/getArticle',Article.getArticle);

    
    app.post('/getArticleList',Article.getArticleList);
    app.post('/updateArticle',Article.updateArticle);
    app.post('/getClassify',Article.getClassify);
    app.post('/removeArticle',Article.removeArticle);

    
    app.post('/putDraft',Draft.putDraft);
    app.post('/getDraft',Draft.getDraft);
    app.post('/getDraftList',Draft.getDraftList);
    app.post('/convertArticle',Draft.convertArticle);
    

}