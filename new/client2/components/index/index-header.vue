<template>
    <div class="index-header">
        这是头部,不过还写好
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
    .index-header{
        display:block;
        width:100%;
        height:35vw;
        border:1px solid blue;
    }
</style>