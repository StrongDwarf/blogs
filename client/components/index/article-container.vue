<template>
    <div class="article-container">
        <div v-if="currentArticleList.length">
            
            <div class="content-body">
                <!--  正文内容子元素  -->
                <div v-for="article in currentArticleList">
                    <div @click.prevent="handlerRouter(article._id)" class="content-body-item"  :id="article._id" to=''>
                        <p class="content-body-item-header">
                            {{article.title}}
                        </p>
                        <p class="content-body-item-classify">
                            <span v-time="article.time"></span>
                            <span v-for="tag in article.tags">{{tag.trim()}}</span>
                        </p>
                        <p class="content-body-item-summary" >
                            {{article.summary}}
                        </p>
                    </div>
                </div>
            </div>
        </div>
        <div v-else>
            <span>无数据</span>
        </div>
    </div>
</template>
<script>
    import Time from '../../globalFunc/time.js'
    export default {
        props:{
            currentArticleList:{
                type:Array,
            }
        },
        computed: {
            
        },
        methods:{
            handlerRouter(id){
                console.log('1');
                console.log(id);
                this.$router.push('/article/'+id+'')
            }
        },
        directives:{
            time:{
                bind(el,binding){
                    el.innerHTML = Time.getFormatTime(binding.value);
                    el.__timeout__ = setInterval(function(){
                        el.innerHTML = Time.getFormatTime(binding.value);
                    },60000);
                },
                unbind:function(el){
                    clearInterval(el.__timeout__);
                    delete el.__timeout__;
                }
            }
        },
    }
</script>
<style>
.article-container{
    width:100%;
    min-height:35vw;
}

 /*  文本样式  */
        .content-body {
            width: 90vw;
            margin: 0 auto;
            margin-top: 20px;
        }

        .content-body-item {
            margin-bottom: 20px;
            border-radius: 8px;
            background-color: #f8f6f6;
            box-shadow: 0 0 3px #b4b1b1;
        }

        .content-body-item p {
            margin-left: 8px;
            margin-right: 8px;
            padding-right: 8px;
        }

        .content-body-item-header {
            font-size: 6vw;
            color: #535353;
        }

        .content-body-item-classify {
            font-size: 4vw;
            color: #ABAAAF;
        }

        .content-body-item-classify span{
            margin-right:1vw;
        }

        .content-body-item-summary {
            color: #635e5e;
            font-size: 4vw;
            overflow: hidden;
            text-overflow: ellipsis;
            height: 17vw;
        }
</style>