<template>
    <div>
        <header-bar
         :value="headerBarName" v-once></header-bar>
        <div style="margin-top:12vw;">
            <div>
                <button @click="WriteNewBlogs">写新博客</button>
            </div>
            <div class="selectContainer">
                <span @click=" draftListPage=true ">草稿列表</span>
                <span @click=" draftListPage=false ">文章列表</span>
            </div>
            <draftList v-if="draftListPage"></draftList>
            <articleEditorList v-else></articleEditorList>
        </div>
    </div>
</template>
<script>
    import draftList from '../components/editor/draft-list.vue'
    import articleEditorList from '../components/editor/article-editor-list.vue'
    import headerBar from '../components/header-bar.vue'
    export default{
        components:{
            draftList,
            articleEditorList,
            headerBar
        },
        data(){
            return{
                headerBarName:'小白菜的博客',
                draftListPage:true
            }
        },
        computed:{

        },
        methods:{
            WriteNewBlogs(){
                this.$router.push('/editor');
            }
        }
    }
</script>
<style>

</style>