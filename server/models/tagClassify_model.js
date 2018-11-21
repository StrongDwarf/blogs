const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//标签分类表
const tagClassifySchema = new Schema({
    type:{
        type:String
    },
    count:{
        type:Number
    },
    childrens:{
        type:Array
    }
})

mongoose.model('TagClassify',tagClassifySchema);