import Vue from 'vue';
import router from './router/index';
import store from './store/index';
import App from './app.vue';
import './style.css';


new Vue({
    el: '#app',
    router: router,
    store: store,
    render: h => {
        return h(App)
    }
});