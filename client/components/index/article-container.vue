<template>
    <div class="article-container">
        这是文章容器
    </div>
</template>
<script>
    export default {
        computed: {
            cartList () {
                return this.$store.state.cartList;
            }
        }
    }
</script>
<style>
.article-container{
    width:100%;
    min-height:35vw;
    border:1px solid yellow;
}
</style>