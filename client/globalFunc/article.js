const articleFunc = {

    formatData(article) {
        for (let i = 0; i < article.length; i++) {
            article[i].data = article[i].data.replace(/~~/g, '&');
            if (article[i].childrens) {
                articleFunc.formatData(article[i].childrens);
            }
        }
        return article;
    },

    getCatalog(article) {
        let cata = [];
        for (let i = 0; i < article.length; i++) {
            if (article[i].type.match(/h[1-4]/)) {
                let o = {
                    type: article[i].type,
                    data: article[i].data
                };
                if (article[i].childrens && article[i].childrens.length) {
                    o['childrens'] = articleFunc.getCatalog(article[i].childrens);
                }
                cata.push(o);
            }
        }
        return cata;
    },
    flatArticle(article) {
        let flatA = [];
        if(!article.length){
            return flatA;
        }
        for (let i = 0; i < article.length; i++) {
            let o = {
                type: article[i].type,
                data: article[i].data,
            }
            if (article[i].childrens && !article[i].type.match(/h[1-4]/)) {
                o.childrens = article[i].childrens;
            }
            flatA.push(o);
            if (article[i].type.match(/h[1-4]/) && article[i].childrens) {
                flatA.push.apply(flatA, articleFunc.flatArticle(article[i].childrens))
            }
        }
        return flatA;
    },
    renderArticle(article){
        articleFunc.formatData(article);
        article = articleFunc.flatArticle(article);
        let str = '';
        for(let i =0;i<article.length;i++){
            switch(article[i].type){
                case 'p':
                    str += `<p>${article[i].data}</p>`;
                    break;
                case 'h1':
                    str += `<h1>${article[i].data}</h1>`;
                    break;
                case 'h2':
                    str += `<h2>${article[i].data}</h2>`;
                    break;
                case 'h3':
                    str += `<h3>${article[i].data}</h3>`;
                    break;
                case 'h4':
                    str += `<h4>${article[i].data}</h3>`;
                    break;
                case 'code':
                    str += `<div class="code">
                                <div class="code-container">`
                    let haveImg = false;
                    for(let j = 0;j<article[i].childrens.length;j++){
                        if(article[i].childrens[j].type == 'img'){
                            str += `</div></div>`;
                            str += `<img src="${article[i].childrens[j].data}" alt="图片无法显示">`;
                            haveImg = true;
                            break;
                        }
                        str += `<p>${article[i].childrens[j].data}</p>`;
                    }
                    if(!haveImg){
                        str += `</div></div>`
                    }
                    break;
                case 'ul':
                    str += `<ul>`
                    for(let j=0;j<article[i]['childrens'].length;j++){
                        str += `<li>${article[i].childrens[j].data}</li>`;
                    }
                    str += `</ul>`
                    break;
                case 'img':
                    str += `<img src="${article[i].data}">`;
                    break;
                default:
                    break
            }
        }
        return str;
    }
}

export default articleFunc