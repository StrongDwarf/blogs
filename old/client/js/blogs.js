/**
 * 公共函数
 */
const globalFunc = {
    template(strings, ...keys) {
        return (function (...values) {
            var dict = values[values.length - 1] || {};
            var result = [strings[0]];
            keys.forEach(function (key, i) {
                var value = Number.isInteger(key) ? values[key] : dict[key];
                result.push(value, strings[i + 1]);
            });
            return result.join('');
        });
    },
    getforMatTime(time) {
        var date = new Date(parseInt(time))
        var now = new Date();
        var strA = '';
        if (now.getFullYear() == date.getFullYear()) {
            if (now.getMonth() == date.getMonth()) {
                const count = now.getDay() - date.getDay();
                switch (count) {
                    case 0:
                        strA += '今天';
                        break;
                    case 1:
                        strA += '昨天';
                        break;
                    case 2:
                        strA += '前天';
                        break;
                    default:
                        strA += (date.getMonth() + 1) + "月" + date.getDay() + "日";
                        break;
                }
            } else {
                strA += (date.getMonth() + 1) + "月" + date.getDay() + "日";
            }

            strA += date.getHours() + ":" + date.getMinutes();
        }
        else {
            strA += date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDay()
        }
        return strA;
    },
    //转为规格化字符串值
    formatValue(value) {
        let rValue = '';
        switch (typeof value) {
            case ('string'):
                eValue = 'string-' + value;
                break;
            case ('object'):
                eValue = 'object-' + JSON.stringify(value);
                break;
            case ('boolean'):
                eValue = 'boolean-' + value;
                break;
            case ('number'):
                eValue = 'number-' + value;
                break;
            case ('function'):
                console.log('错误,函数无法保存');
                return false;
                break;
            default:
                eValue = 'string-' + value;
                break;
        }
        return rValue;
    },
    //解析字符串
    getValue(value) {
        let list = value.split('-');
        switch (list[0]) {
            case ('string'):
                value = list[1];
                break;
            case ('object'):
                value = JSON.parse(list[1]);
                break;
            case ('boolean'):
                value = Boolean(list[1]);
                break;
            case ('number'):
                value = Number(list[1])
                break;
            default:
                value = list[1];
                break;
        }
        return value;
    },
    ajax: {
        get(url, callback) {
            let xhr = new XMLHttpRequest();
            xhr.open('get', url, true);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
            xhr.send();
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    //console.log(ajax.responseText);  //输入相应的内容
                    callback(xhr.responseText);
                }
            }
        },
        post(url, data, callback) {
            let xhr = new XMLHttpRequest();
            xhr.open('post', url, true);
            xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            //xhr.send('data='+JSON.stringify(data));
            //var fd = new FormData();
            //fd.append("data",'111');
            //fd.append("people",'userid');
            //fd.append("ck",'ck');
            xhr.send('data=' + JSON.stringify(data));
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    callback(xhr.responseText);
                }
            }
        }
    }
}

/**
 * 定义博客数据
 * this.ArticleList = [{id:'',data:''},{'id':'',data:''}]
 */

class BlogsData {
    constructor() {
        this.id = null; //目前活动的文章的id
        this.time = (new Date()).getTime(); //目前加载的文章列表的最迟time
        this.Article = '';  //目前浏览的文章数据
        this.ArticleList = ''; //目前加载的文章列表
        this.page = 0;     //目前主页的页数
        this.Articles = '';  //目前加载的文章数据
        this.url = new BlogsUrl('http://127.0.0.1/');
    }
    getArticle() {
        //id存在,返回当前id对应的文章数据
        if (this.id) {
            //当缓存中存在时,直接从缓存中读取
            for (let i = 0; i < this.ArticleList.length; i++) {
                if (this.ArticleList[i].id == this.id) {
                    return this.ArticleList[i].data;
                }
            }
            //当缓存中不存在时,从后端拉取
            globalFunc.ajax.post(this.url.getArticle, { 'id': this.id }, (data) => {
                //将数据保存到ArtivleList

            });

        } else {

        }
    }
}


/**
 * 渲染函数,
 */
const Render = {
    renderAticleList(el, dataList) {
        //定义一个模板
        const itemTemplate = globalFunc.template`
            <p class="content-body-item-header">
                ${'title'}
            </p>
            <p class="content-body-item-classify">
                <span>${'time'}</span>
                <span>${'tags0'}</span>
                <span>${'tags1'}</span>
                <span>${'tags2'}</span>
            </p>
            <p class="content-body-item-summary">
                ${'summary'}
            </p> 
        `;
        for (let i = 0; i < dataList.length; i++) {
            let data = dataList[i];
            let item = document.createElement('div');
            item.classList.add('content-body-item');
            data.tags0 = data.tags[0];
            data.tags1 = data.tags[1];
            data.tags2 = data.tags[2];
            data.time = globalFunc.getforMatTime(data.time);
            item.innerHTML = itemTemplate(data);
            //console.log(item.innerHTML);
            el.appendChild(item);
        }
    },
}