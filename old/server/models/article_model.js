const mongoose = require('mongoose'),
	Schema = mongoose.Schema;

//根节点
const rootNodeSchema = new Schema({
	type:{
		type:String
	},
	time:{
		type:String,
		index:1
	},
	title:{
		type:String
	},
	isSecret:{
		type:Boolean
	},
	summary:{
		type:String
	},
	tags:{
		type:Array
	},
	childrens:{
		type:Array
	}
})

mongoose.model('Article',rootNodeSchema);