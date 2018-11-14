const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//时间分类表
const userSchema = new Schema({
    account:{
        type:String
    },
    pawd:{
        type:Number
    },
})

mongoose.model('User',userSchema);