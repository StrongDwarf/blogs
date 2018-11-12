require('../models/article_model.js');
const mongoose = require('mongoose');
const Article = mongoose.model('Article');

/**
 *
 * @param {childrens:data中的正文内容数据} data 
 * @explain 获取data一级节点中所有的文字数据作为summary。
 */
function getSummary(data){
	let str = '';
	for(let i = 0;i<data.childrens.length;i++){
		str += data.childrens[i].data; 
	}
	return str;
}

module.exports = {
	put(req, res) {
		console.log(req.body.data);
		
		let data = JSON.parse(req.body.data);
		console.log(data);
		/*
		let ac = new Article({ 'time': data.time+'' });
		ac.set('type',data.type);
		ac.set('title',data.title);
		ac.set('isSecret',true);
		ac.set('summary',getSummary(data));
		ac.set('tags',data.tags);
		ac.set('childrens',data.childrens);
		ac.save(function (err, ac) {
			if (err) {
				console.log('插入数据库出错');
				console.log(err);
			}
			console.log(ac);
		}) */
	},
	get() {
		Article.find({}).limit(10).lt('time', req.body.time)
				.exec(function(err, bs) {
					if(err) {
						console.log(err);
						res.json({
							type: 2
						});
						return;
					}
					if(!bs[0]){
						res.json({'type':1});
						return;
					}
					res.json({
						'type': 0,
						'list': bs
					});
					return;
				})
	}
}
