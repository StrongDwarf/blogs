import Vue from 'vue'
import Vuex from 'vuex'
import Ajax from './ajax.js'
import apiUrl from './apiUrl.js'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        currentArticleId:'',        //当前浏览的文章id
        articleList:[],             //接收的文章列表
        draftList:[],               //草稿列表
        currentArticle:'',          //当前的文章页面
        tagsList:{                  //从服务器获取的tags，保存了现有的所有tags
            tags:['CSS','HTML','JavaScript','设计模式',]
        },                    
    },
    getters: {
        brands: state => {
            const brands = state.productList.map(item => item.brand);
            return getFilterArray(brands);
        },
        colors: state => {
            const colors = state.productList.map(item => item.color);
            return getFilterArray(colors);
        },
        tags: state=> {
            const tags = state.tagsList.tags;
            return tags;
        }
    },
    mutations: {
        // 添加商品列表
        setProductList(state, data) {
            state.productList = data;
        },
    },
    actions: {
        // 请求商品列表
        getProductList(context) {
            // 真实环境通过 ajax 获取，这里用异步模拟
            setTimeout(() => {
                context.commit('setProductList', product_data);
            }, 500);
        },
        //请求文章列表
        getArticleList(context){
            Ajax.post(apiUrl.getArticleList,{},(res)=>{
                console.log(res);
            })
        }

    }
});

export default store
