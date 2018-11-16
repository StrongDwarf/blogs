<template>
    <input 
    style="display:block;width:100%;height:6vw;background:#f3f3f3;margin-bottom:1vw;border:1px solid transparent"
    v-model="value" placeholder="请输入文章标题">
</template>
<script>
export default{
    props:{
        value:{
            type:String,
        }
    },
    
}
</script>
<style>
</style>