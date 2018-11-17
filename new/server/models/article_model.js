const mongoose = require('mongoose'),
	Schema = mongoose.Schema;

//根节点
const rootNodeSchema = new Schema({
	time:{
		type:String,
		index:1
	},
	title:{
		type:String,
		required:true
	},
	signature:{
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
	article:{
		type:Array
	}
})

mongoose.model('Article',rootNodeSchema);