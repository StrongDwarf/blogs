<template>
    <div class="page-tab">
        这是换页标签，也还没写好
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
.page-tab{
    border:1px solid grey;
    min-height:10vw;
}
</style>