<template>
    <div class="header-bar">
        {{value}}
    </div>
</template>
<script>
export default {
  props: {
    value: {
      type: String,
      default: "小白菜的博客"
    }
  }
};
</script>
<style>
.header-bar {
  width:100vw;
  position: fixed;
  top:0px;
  left:0px;
  display: block;
  text-align: center;
  text-decoration: none;
  background-color: #222222;
  color: #fffeff;
  text-shadow: 0 0 10px gainsboro;
  font-size: 6vw;
  padding: 0 0 0 0;
}
</style>