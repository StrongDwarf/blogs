const host = `http://127.0.0.1:8083`

const apiUrl = {
    //获取文章列表接口
    getArticleList:`${host}/getArticleList`,
    //获取指定id的文章列表接口
    getArticle:`${host}/getArticle`,
    //发布文章列表
    putArticle:`${host}/putArticle`,

    //发布草稿
    putDraft:`${host}/putDraft`
    
}
export default apiUrl