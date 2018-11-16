<template>
    <div style="margin-top:3vw;margin-bottom:1vw;">
        <p style="margin-bottom:2vw;height:5vw;position:relative;">
            <label >选择标签:</label>
            <input  v-show="isshow" 
                    @keydown.enter="addtag"  
                    v-model="tagadd" 
                    placeholder="新标签名"
                    style="height:5vw;position:">
            <span @click=" isshow = !isshow ">+添加新标签</span>
        </p>
        <ul class="tags-container">
            <li class="tag" 
                v-for=" tag in selecttags " 
                :class = "{'select': tags.indexOf(tag)!= -1 }"
                @click="pushTag(tag)" >{{tag}}</li>
        </ul>
    </div>
</template>
<script>
export default{
    props:{
        tags:{
            type:Array,
            default:[]
        }
    },
    data(){
        return{
            selecttags:[],
            isshow:false,
            tagadd:''
        }
    },
    mounted:function(){
        this.selecttags = this.$store.getters.tags
    },
    methods:{
        addtag(){
            const _this = this;

            if(_this.tagadd && _this.tagadd.trim()){
                _this.selecttags.push(_this.tagadd);
            }
            _this.isshow = false;
        },
        pushTag(tag){
            const _this = this;
            let index = _this.tags.indexOf(tag);
            if(index == -1){
                _this.tags.push(tag);
            }else{
                _this.tags.splice(index,1);
            }
        }
    }
}
</script>
<style>
.tags-container{
    width:100%;
    border:1px solid #999999;
    border-radius:2px;
}
.tag{
    display: inline-block;
    width:30%;
    border:1px solid #999999;
    margin:1vw 1vw 1vw 1vw;
    text-align:center;
    border-radius:2px;
}
.tag.select{
    background-color:#999999;
}
</style>