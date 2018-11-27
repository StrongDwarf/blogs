const host = `http://127.0.0.1:8083`

const apiUrl = {
    
    putArticle:`${host}/putArticle`,
    getArticle:`${host}/getArticle`,
    getArticleList:`${host}/getArticleList`,
    updateArticle:`${host}/updateArticle`,
    removeArticle:`${host}/removerticle`,

    getTimeClassify:`${host}/getTimeClassify`,
    getTagClassify:`${host}/getTagClassify`,

    putDraft:`${host}/putDraft`,
    getDraft:`${host}/getDraft`,
    getDraftList:`${host}/getDraftList`,
    convertArticle:`${host}/convertArticle`,

    getTags:`${host}/getTags`,
    
}
export default apiUrl