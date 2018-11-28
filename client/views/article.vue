<template>
    <div>
        <header-bar
         :value="headerBarName" v-once></header-bar>
        <div class="article-container">
            <div class="content-body">
                <div class="article-header">
                    <p class="article-header-name">
                        {{article.title}}
                    </p>
                    <p class="article-header-tags">
                        <span v-for="tag in article.tags">{{tag}}/</span>
                    </p>
                    <p class="article-header-signature">
                        {{article.signature}}
                    </p>
                </div>
                <div class="article-body" v-html="articleHtml">
                    
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import headerBar from '../components/header-bar.vue'
    import articleFunc from '../globalFunc/article.js'
    export default{
        data(){
            return{
                headerBarName:'小白菜的博客',
            }
        },
        components:{
            headerBar
        },
        methods:{
            
        },
        computed:{
            article(){
                let article = this.$store.state.currentArticle;
                console.log(this.$store.state.currentArticle);
                return article;
            },
            articleBody(){
                let article = this.$store.state.currentArticle;

            },
            catalog(){
                let article = this.$store.state.currentArticle;
                return articleFunc.getCatalog(article.article);
            },
            articleHtml(){
                let article = this.$store.state.currentArticle;
                return articleFunc.renderArticle(article.article);
            }
        },
        mounted(){
            this.$store.dispatch('getArticle',this.$route.params.id);
        }
    }
</script>
<style>
    .article-container{
        margin-top:10vw;
    }
    .content-body{
    width:94vw;
    margin:8vw auto 0;
}

/*文章头部样式*/
.article-header{
    padding-top:10vw;
    margin-top:5vw;
    margin-bottom:4vw;
    text-align:center;
}
.article-header-name{
    font-size: 6vw;
    color: #535353;
}
.article-header-tags{
    display: block;
    margin-top:1vw;
    margin-bottom:3vw;
}
.article-header-tags span{
    font-size: 3vw;
    color: #ABAAAF;
}

.article-header-signature{
    display: block;
    width:60vw;
    margin:0 auto;
    font-size:3.6vw;
    color:#636363;
    border:1px solid #afafaf;
    padding:0 4vw 0 4vw;
    border-radius:20vw;
}

.article-body{
    padding-top:3vw;
}
.article-body h1,h2,h3,h4{
    color:#222222
}
.article-body h1{
    margin-top:2vw;
    font-size:5vw;
}
.article-body h2{
    margin-top:1.5vw;
    font-size:4.6vw;
    font-weight:700;
}
.article-body h3{
    margin-top:1vw;
    font-size:4vw;
    font-weight:700;
}
.article-body h4{
    margin-top:1vw;
    font-size:3.6vw;
    font-weight:700;
}
h1 h2 h3 h4{
    
}
.article-body p{
    text-indent:2em;
    margin-top:1vw;
    margin-bottom:1vw;
}
.article-body ul{
    list-style: none;
    border-left:3px solid #ABAAAF;
    margin-left:1em;
    margin-right:1em;
    background-color:#eeeeee;
}
.article-body ul li{
    color:#999999;
    border-bottom:1px solid #ABAAAF;
}
.article-body img{
    max-width: 90vw;
}

.article-body .code{
    background-color:#333333;
    border-radius:4px;
}
.code .code-container{
    width:90vw;
    background-color:#1e1e1e;
    margin:0 auto;
    border-top:2vw solid #333333;
    border-bottom:2vw solid #333333;
    color:#DAD4D8;
    padding-top:1vw;
    padding-bottom:1vw;
}
.code-container p{
    padding: 0px;
    margin: 0px;
}
</style>