const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//时间分类表
const timeClassifySchema = new Schema({
    type:{
        type:String
    },
    count:{
        type:Number
    },
    lastTime:{
        type:Number
    },
    childrens:{
        type:Array
    }
})

mongoose.model('TimeClassify',timeClassifySchema);