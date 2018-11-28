<template>
    <div>
        <div style="margin:0 auto;text-align:center;margin-top:3vw;">
            <span style="font-size:4vw;">
                编辑博客
            </span>
        </div>
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
            valueInput,
            articleEditor,
            tagsSelect
        },
        methods:{
            isEmpty(){
                if(!this.article.title){
                    alert('文章不能没有标题')
                    return false;
                }
                if(!this.article.signature){
                    alert('文章不能没有签名')
                    return false
                }
                if(!this.article.article){
                    alert('文章不能没有内容')
                    return false
                }
                if(!this.article.tags){
                    alert('文章不能没有标签')
                    return false
                }
                return true
            },
            put(){
                console.log(this.article);
                if(this.isEmpty()){
                    Ajax.post(apiUrl.putArticle,{data:this.article},function(res){
                        console.log(res);
                    })
                }
            },
            submit(){
                console.log(this.article);
                const _this = this;
                if(this.isEmpty()){
                    Ajax.post(apiUrl.putArticle,{data:this.article},function(res){
                        alert('发布文章成功');
                        console.log(res);
                    })
                }
            },
            save(){
                const _this = this;
                if(this.isEmpty()){
                    Ajax.post(apiUrl.putDraft,{data:this.article},function(res){
                        alert('保存文章成功');
                        console.log(res);
                    })
                }
            },
        },
        mounted(){
            this.$store.dispatch('getTags');
        }
    }
</script>
<style>
.editor-container{
    margin-top:4vw;
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
