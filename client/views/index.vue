<template>
    <div>
        <indexHeader></indexHeader>
        <articleContainer :currentArticleList="currentArticleList"
        ></articleContainer>
        <pageTab></pageTab>
    </div>
</template>
<script>
    import indexHeader from '../components/index/index-header.vue'
    import articleContainer from '../components/index/article-container.vue'
    import pageTab from '../components/index/page-tab.vue'
    export default {
        components:{
            indexHeader,
            articleContainer,
            pageTab
        },
        data(){
            return {
                
            }
        },
        computed:{
            currentArticleList(){
                return this.$store.state.currentArticleList;
            }
        },
        mounted(){
            this.$store.dispatch('getArticleList');
        }
    }
</script>