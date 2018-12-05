var fs = require('fs');

var learningNotesPath = "../../learning-notes/";

const articleFunc = {
    formatData(article) {
        for (let i = 0; i < article.length; i++) {
            //article[i].data = article[i].data.replace(/\s/g,'+');
            article[i].data = article[i].data.replace(/~~/g, '&');
            article[i].data = article[i].data.replace(/&nbsp;/g, '  ');
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
        if (!article.length) {
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
    renderArticle(article) {
        articleFunc.formatData(article);
        article = articleFunc.flatArticle(article);
        let str = '';
        for (let i = 0; i < article.length; i++) {
            switch (article[i].type) {
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
                    for (let j = 0; j < article[i].childrens.length; j++) {
                        if (article[i].childrens[j].type == 'img') {
                            str += `</div></div>`;
                            str += `<img src="${article[i].childrens[j].data}" alt="图片无法显示">`;
                            haveImg = true;
                            break;
                        }
                        str += `<p>${article[i].childrens[j].data}</p>`;
                    }
                    if (!haveImg) {
                        str += `</div></div>`
                    }
                    break;
                case 'ul':
                    str += `<ul>`
                    for (let j = 0; j < article[i]['childrens'].length; j++) {
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
    },
    getArticleMDString(article) {
        //let catalog = this.getCatalog(article);
        articleFunc.formatData(article);
        article = articleFunc.flatArticle(article);
        let str = '';
        for (let i = 0; i < article.length; i++) {
            switch (article[i].type) {
                case 'p':
                    str += `&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${article[i].data}<br>\n`;
                    break;
                case 'h1':
                    str += `## ${article[i].data}\n`;
                    break;
                case 'h2':
                    str += `### ${article[i].data}\n`;
                    break;
                case 'h3':
                    str += `#### ${article[i].data}\n`;
                    break;
                case 'h4':
                    str += `##### ${article[i].data}\n`;
                    break;
                case 'code':
                    str += '```\n'
                    for (let j = 0; j < article[i].childrens.length; j++) {
                        str += `${article[i].childrens[j].data}\n`;
                    }
                    str += '```\n'
                    break;
                case 'ul':
                    for (let j = 0; j < article[i]['childrens'].length; j++) {
                        str += `* ${article[i].childrens[j].data}\n`;
                    }
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

/*
fs.writeFile(learningNotesPath+'xiaobaicai.md',data,function(err){
    if(err){
        console.log(err)
    }else{
        console.log('写入成功!');
    }
})
*/

let datePutArticleCountArray = {};


const writeFile = {
    writeFile(article) {
        let str = '';
        str += '# ' + article.title + '\n';
        str += articleFunc.getArticleMDString(article.article);
        str = str.replace(/\&lt;/g,'<');
        str = str.replace(/\&gt;/g,'>');
        let time = new Date(Date.now()).toLocaleDateString();
        let articleFileName = article.title + '.md';
        //判断今天发了几篇文章
        if(datePutArticleCountArray[time]){
            datePutArticleCountArray[time]++;
        }else{
            datePutArticleCountArray[time] = 1;
        }
        articleFileName = time+'-'+datePutArticleCountArray[time]+'-'+articleFileName;
        var month = ((new Date()).getMonth() + 1) + '月';
        let path = learningNotesPath +'/时间分类/'+ month + '/' + articleFileName;
        if (!fs.existsSync(learningNotesPath +'/时间分类/'+  month )) {
            fs.mkdirSync(learningNotesPath +'/时间分类/'+  month );
        }
        //按照月份写入时间表中
        fs.writeFile(path, str, function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log('写入成功!');
            }
        })
        //按照标签写入标签表中
        console.log(article.tags);
        if (article.tags) {
            for (let i = 0; i < article.tags.length; i++) {
                path = learningNotesPath + '/标签分类/'+article.tags[i] + '/' + articleFileName;
                //如果文件夹不存在，创建文件夹
                if (!fs.existsSync(learningNotesPath + '/标签分类/'+ article.tags[i])) {
                    fs.mkdirSync(learningNotesPath+ '/标签分类/' + article.tags[i]);
                }
                fs.writeFile(path, str, function (err) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log('写入成功!');
                    }
                })
            }
        }
    }
}


module.exports = writeFile;