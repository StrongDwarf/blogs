const mongoose = require('mongoose'),
	Schema = mongoose.Schema;

//根节点
const draftSchema = new Schema({
	type:{
		type:String
	},
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
	childrens:{
		type:Array
	}
})

mongoose.model('Article',draftSchema);