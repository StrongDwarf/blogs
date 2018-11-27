import Vue from 'vue'
import Vuex from 'vuex'
import Ajax from './ajax.js'
import apiUrl from './apiUrl.js'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        /**
         * 调用state中的数据:this.$store.state.article
         */
        currentArticleId: '',           //当前浏览的文章id
        articleList: [],                //接收的文章列表
        currentArticleList:[],          //当前显示的文章列表
        draftList: [],                  //草稿列表
        currentArticle:{},           //当前的文章页面 
        articleCache:{},
        tags: ['CSS', 'HTML', 'JavaScript', '设计模式',],
      //  timeArticleListCache:{},        //根据时间获取的文章的缓存
      //  idArticleListCache:{},          //根据id获取的文章的缓存
        timeClassify:[],                //时间分类
        tagClassify:[],                 //标签分类
    },
    getters: {
        /**
         * 调用getters中的方法,this.$store.getters.brands;
         */
        
        tags: state => {
            const tags = state.tags;
            return tags;
        }
    },
    mutations: {
        /**
         * 调用mutations中的方法,this.$store.commit('setTags',data);
         */
        setTags(state, data) {
            state.tags = data
        },
        setArticle(state,article){
            //console.log(article)
            state.currentArticle = article;
            //state.articleCache.push(article);
        },
        setTimeClassify(state,timeClassify){
            state.timeClassify = timeClassify
        },
        setTagClassify(state,tagClassify){
            state.tagClassify = tagClassify
        },
        setArticleList(state,articleList){
            console.log(articleList);
            state.currentArticleList = articleList;
        },
        setIdArticleList(state,articleList){
            state.currentArticleList = articleList;
        },
        setTimeArticleList(state,articleList){
            state.currentArticleList = articleList;
        }
    },
    actions: {
        /**
         * 调用action中的方法, this.$store.dispatch('increment',data);
         */
        getTags(context) {
            Ajax.post(apiUrl.getTags, {}, (res) => {
                context.commit('setTags', res.tags);
            })
        },
        getArticle(context, id) {
            Ajax.post(apiUrl.getArticle, { id }, (res) => {
                context.commit('setArticle', res.article);
            })
        },
        getTimeClassify(context) {
            Ajax.post(apiUrl.getTimeClassify, {}, (res) => {
                context.commit('setTimeClassify', res.timeClassify);
            })
        },
        getTagClassify(context) {
            Ajax.post(apiUrl.getTagClassify, {}, (res) => {
                context.commit('setTagClassify', res.tagClassify);
            })
        },
        getArticleList(context) {
            Ajax.post(apiUrl.getArticleList, {}, (res) => {
                context.commit('setArticleList', res.articleList);
            })
        },
        getArticleListBytime(context, time) {
            Ajax.post(apiUrl.getArticleList, { type: 'time', time: time }, (res) => {
                context.commit('setTimeArticleList', res.articleList);
            })
        },
        getArticleListById(context,idList){
            Ajax.post(apiUrl.getArticleList,{type:'idList',idList:idList},(res) => {
                context.commit('setIdArticleList', res.articleList);
            })
        }
    }
});

export default store
