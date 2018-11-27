import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter);

const Routers = [
    {
        path:'/index',
        meta:{
            title:'小白菜的博客'
        },
        component:(resolve) => require(['../views/index.vue'],resolve)
    },
    {
        path:'/xiaobaicai',
        meta:{
            title:'小白菜又来写博客啦'
        },
        component:(resolve) => require(['../views/xiaobaicai.vue'],resolve)
    },
    {
        path:'/editor',
        meta:{
            title:'编辑博客'
        },
        component:(resolve) => require(['../views/editor.vue'],resolve)
    },
    {
        path:'/article/:id',
        meta:{
            title:'文章详情页'
        },
        component:(resolve) => require(['../views/article.vue'],resolve)
    },
    {
        path: '*',
        redirect: '/index'
    }
];

// 路由配置
const RouterConfig = {
    // 使用 HTML5 的 History 路由模式
    mode: 'history',
    routes: Routers
};
const router = new VueRouter(RouterConfig);

router.beforeEach((to, from, next) => {
    window.document.title = to.meta.title;
    next();
});

router.afterEach((to, from, next) => {
    window.scrollTo(0, 0);
});

export default router;