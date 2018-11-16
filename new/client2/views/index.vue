<template>
    <div>
        <indexHeader></indexHeader>
        <articleContainer></articleContainer>
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
        }
    }
</script>