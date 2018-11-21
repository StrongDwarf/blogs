<template>
    <div>
        <div id="editor" contenteditable="true" v-pastePhoto
            @input.prevent="onDivInput($event)">
            <p><br></p>
        </div>
    </div>
</template>
<script>
import { setInterval } from "timers";
import editorFunc from "./editorFunc.js";
import Vue from "vue";
Vue.directive("clickout", {
  bind: function(el, binding, vnode) {
    function documentHandler(e) {
      if (el.contains(e.target)) {
        return false;
      }
      if (binding.expression) {
        binding.value(e);
      }
    }
    el.__vueClickOutside__ = documentHandler;
    document.addEventListener("click", documentHandler);
  },
  unbind: function(el, binding) {
    document.removeEventListener("click", el.__vueClickOutside__);
    delete el.__vueClickOutside__;
  }
});
Vue.directive("pastePhoto", {
  bind: function(el, binding, vnode) {
    function documentHandler(event) {
      if (event.clipboardData || event.originalEvent) {
        var clipboardData =
          event.clipboardData || event.originalEvent.clipboardData;
        if (clipboardData.items) {
          var isImage = false;
          for (var i = 0; i < clipboardData.items.length; i++) {
            if (clipboardData.items[i].type.indexOf("image") !== -1) {
              var blob;
              blob = clipboardData.items[i].getAsFile();
              isImage = true;
              var render = new FileReader();
              render.onload = function(evt) {
                //输出base64编码
                var base64 = evt.target.result;
                var img = document.createElement("img");
                img.classList.add("content-img");
                img.setAttribute("src", base64);
                el.appendChild(img);
                //document.getElementById('img').setAttribute('src', base64);
              };
              render.readAsDataURL(blob);
            }
          }
          //如果不是image
          if (!isImage) {
            var str1 = clipboardData.getData("text");
            var p = document.createElement("p");
            p.innerHTML = str1;
            el.appendChild(p);
            console.log(str1);
            event.preventDefault();
          }
        }
      }
    }
    el.__vuePastePhoto__ = documentHandler;
    document.addEventListener("paste", documentHandler);
  },
  unbind: function(el, binding) {
    document.removeEventListener("paste", el._vueClickOutside);
    delete el.__vueClickOutside__;
  }
});
export default {
  props: {
    article: {
      type: Array
    }
  },
  data() {
    return {
      myHtmlCode: "",
      target: ""
    };
  },
  created() {},
  mounted() {
    const _this = this;
    setInterval(function() {
      if (_this.target) {
        _this.$emit("input", editorFunc.getArticle(_this.target));
      }
    }, 2000);
  },
  methods: {
    clickout() {
      console.log("xiaobaicia");
    },
    onDivInput: function(e) {
      this.target = e.target;
    }
  }
};
</script>
<style>
#editor {
  height: 80vh;
  width: 100%;
  border: 1px solid #dddddd;
  background-color: #f3f3f3;
  overflow-y: scroll;
}
#editor img{
  max-width: 96%;
}
</style>