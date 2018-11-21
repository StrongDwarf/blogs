<template>
    <div>
        <header-bar
         :value="headerBarName" v-once></header-bar>
        <div class="editor-container">
            <input 
                class="input"
                v-model="article.title" placeholder="请输入文章标题">
            <input 
                class="input"
                v-model="article.signature" placeholder="请输入文章签名">
            <articleEditor :article="article.article" v-model="article.article"></articleEditor>
            <tagsSelect :tags="article.tags"></tagsSelect>
            <div>
                <button class="submit" @click="save">保存</button>
                <button class="submit" @click="submit">发布</button>
            </div>
        </div>
    </div>
</template>
<script>
    import headerBar from '../components/header-bar.vue'
    import valueInput from '../components/editor/value-input.vue'
    import articleEditor from '../components/editor/article-editor.vue'
    import tagsSelect from '../components/editor/tags-select.vue'
    import { setInterval } from 'timers';
    import Ajax from '../store/ajax.js';
    import apiUrl from '../store/apiUrl.js'
    export default{
        data(){
            return{
                headerBarName:'小白菜的编辑器',
                article:{
                    title:'',
                    signature:'',
                    article:[],
                    tags:[],
                    type:'save',
                }
            }
        },
        components:{
            headerBar,
            valueInput,
            articleEditor,
            tagsSelect
        },
        methods:{
            isEmpty(){
                if(!title){
                    return false;
                }
                if(!signature){
                    return false
                }
                if(!article){
                    return false
                }
                if(!tags){

                }
            },
            put(){
                console.log(this.article);

                Ajax.post(apiUrl.putArticle,{data:this.article},function(res){
                    console.log(res);
                })
            },
            submit(){
                console.log('点击了提交');
                const _this = this;
                _this.article.type = 1;
                _this.put();
            },
            save(){
                const _this = this;
                _this.article.type = 0;
                _this.put();
            },
        },
        mounted(){
        }
    }
</script>
<style>
.editor-container{
    margin-top:12vw;
    margin-left:2vw;
    margin-right:2vw;
    margin-bottom:35vw;
}
.input{
    display:block;
    width:100%;
    height:6vw;
    background:#f3f3f3;
    margin-bottom:1vw;
    border:1px solid transparent;
    font-size:3vw;
}
.submit{
    display: inline-block;
    font-size:5vw;
    margin-top:1vw;
    margin-bottom:1vw;
    padding-left:3vw;
    padding-right:3vw;
    border:1px solid red;
    border-radius:2px;
}
</style>
