require('../models/article_model.js');
require('../models/draft_model.js');
require('../models/tagClassify_model.js');
require('../models/timeClassify_model.js');
const mongoose = require('mongoose');
const Article = mongoose.model('Article');
const Draft = mongoose.model('Draft');
const TagClassify = mongoose.model('TagClassify');
const TimeClassify = mongoose.model('TimeClassify');

/**
 * get article summary
 * @param {Array} article
 * @param {String} return
 */
function getSummary(article) {
	let str = '';
	for (let i = 0; i < article.length; i++) {
		str += article[i].data;
		if (str.length > 80) {
			break;
		}
	}
	return str;
}

/**
 * init()
 * When the program is first activated, the function is called to complete initialization.
 */
function init() {
	let tcf = new TagClassify({
		'type': 'root',
		'count': 0,
		'childrens': []
	})
	let timecf = new TimeClassify({
		'type': 'root',
		'count': 0,
		'childrens': []
	})
	tcf.save(function (err, tcf) {
		if (err) { console.log(err) }
		console.log('插入第一条tagcf数据');
		console.log(tcf);
	})
	timecf.save(function (err, tcf) {
		if (err) { console.log(err) }
		console.log('插入第一条timecf数据');
		console.log(tcf);
	})
}
//init()


/**
 * update tagClassify  in database
 * Called when inserting new data into the article table
 * 
 * @param {tags:Array,id:String} article 
 * @param {true|false} return
 */
function updateTagClassify(article) {
	const tags = article.tags;
	if (!tags) { return }
	let o = {
		'id': article.id,
	}

	TagClassify.findOneAndUpdate({})
		.exec(function (err, tcf) {
			if (err) { console.log(err) }
			for (let i = 0; i < tags.length; i++) {
				/* Set a tag if tag is found in TagClassify. Then set true */
				let hasTag = false;
				for (let j = 0; j < tcf.childrens.length; j++) {
					if (tcf.childrens[j].tag_name == tags[i]) {
						hasTag = true;
						tcf.childrens[j].count++;
						tcf.count++;
						tcf.childrens[j].childrens.push(o);
						break;
					}
				}
				if (!hasTag) {
					let children = {
						'tag_name': tags[i],
						'count': 0,
						'childrens': []
					}
					children.childrens.push(o);
					children.count++;
					tcf.count++;
					tcf.childrens.push(children);
				}
			}
			tcf.save((err, tcf) => {
				if (err) { 
					console.log('Failed to update tagClassify table');
					console.log(err);
					return false;
				}
				console.log('Success to update tagClassify table');
				console.log(tcf);
				return true;
			})
		})
}

/* 
@test updateTagClassify(article) 
var article ={
	tags:['a','b','c'],
	id:'123456'
}

updateTagClassify(article);
*/


/**
 * update timeClassify  in database
 * Called when inserting new data into the article table
 * 
 * @param {time:Number,id:String} article 
 * @param {true|false} return
 */
function updateTimeClassify(article) {
	TimeClassify.findOneAndUpdate({}).exec(function (err, timecf) {
		if (err) { console.log(err) }
		const date = new Date(article.time);
		let obj = {
			'year': date.getFullYear(),
			'count': 1,
			'childrens': [{
				'month': date.getMonth() + 1,
				'count': 1,
				'childrens': [{
					'day': date.getDate(),
					'count': 1,
					'childrens': [{
						'article_id': article.id
					}]
				}]
			}]
		}
		timecf.count++;
		insertTimeClassify(timecf.childrens, obj, ['year', 'month', 'day']);
		timecf.save(function (err, timecf) {
			if (err) { 
				console.log('Failed to update timeClassify table');
				console.log(err);
				return false;
			 }
			console.log('Success to update timeClassify table');
			console.log(timecf);
			return true;
		})
	})
}

/**
 * insert article.id into timeClassify
 * 
 * @param {Array} childrens 
 * @param {Object} obj 
 * @param {Array} arr
 * @param {undefined} return
 */
function insertTimeClassify(childrens, obj, arr) {
	let a = arr.shift()
	if (childrens.length > 0 && childrens[childrens.length - 1][a] && childrens[childrens.length - 1][a] === obj[a]) {
		childrens[childrens.length - 1].count++;
		obj = obj.childrens[0]
		if (arr.length == 0) {
			childrens[childrens.length - 1].childrens.push(obj);
			return;
		}
		else if (arr.length > 0) {
			return insertTimeClassify.apply(this, [childrens[childrens.length - 1].childrens, obj, arr])
		}
	}
	childrens.push(obj);
}



const articleController = {

	/**
	 * put article
	 * 
	 * @param {Object:{data:{type,title,signature,tags,article}}} req.body 
	 * @param {JSON:{success|error,message,id}} res 
	 */
	putArticle(req, res) {
		const data = JSON.parse(req.body.data);
		let article = {
			'time': Date.now(),
			'title': data.title,
			'signature': data.signature,
			'tags': data.tags,
			'article': data.article,
			'isSecret': false,
			'summary': getSummary(data.article)
		};

		//type为0,表示是保存, 则放在草稿表中
		if (data.type == 'save') {
			const ac = new Draft(article);
			ac.save(function (err, ac) {
				if (err) { 
					console.log(err);
					res.status(500).json({
						error:true,
						message:'保存草稿出错',
					}).end();
				}
				console.log('插入草稿表成功');
				console.log(ac);
				res.status(200).json({
					success:true,
					message:'保存草稿成功',
					id:ac.id
				}).end();
			})
		}
		else if (data.type == 'put') {
			const ac = new Article(article);
			ac.save(function (err, ac) {
				if (err) { 
					console.log(err);
					res.status(500).json({
						error:true,
						message:'保存文章出错',
					}).end();
				}
				console.log('插入到文章表中成功');
				console.log(ac);
				if(updateTimeClassify(ac) && updateTagClassify(ac)){
					res.status(200).json({
						success:true,
						message:'发布文章成功',
						id:ac.id
					}).end()
				}else{
					res.status(500).json({
						error:true,
						message:'更新时间表或标签表出错',
						id:ac.id
					})
				}
			})
		}
	},

	/**
	 * get article by id
	 * 
	 * @param {id:Number} req.body
	 * @param {error|success,message,article:Array}
	 */
	getArticle(req, res) {
		if (req.body.id) {
			Article.findOne({ '_id': req.body.id })
				.exec((err, article) => {
					if (err) {
						console.log(err);
						res.statue(404).json({
							error:true,
							message:'查询文章失败',
						}).end();
					}
					res.status(200).json({
						success:true,
						message:'查询文章成功',
						article:article.article
					}).end();
				})
		}
	},

	/**
	 * get articleList by time or idList
	 * if time: You will get 20 articles in the latest time later than a;
	 * if idList: You will get data matching ID with idList.
	 * 
	 * @param {mode,time|idList} req.body
	 * @param {success|err,ArrayList} res 
	 */
	getArticleList(req, res) {
		if (req.body.type) {
			switch (req.body.type) {
				//根据时间来获取文章列表
				case '0':
					//查找时间早于req.body.time的数据
					Article.find({}, { 'title': 1, '_id': 1, 'time': 1, }).limit(10).lt('time', req.body.time)
						.exec((err, articleList) => {
							if (err) {
								console.log(err);
								res.json({ 'type': 1 })
								res.end();
							}
							res.json({ 'type': 0, 'data': JSON.stringify(articleList) })
							res.end();
						})
					break;
				//根据标签来获取文章列表
				case '1':
					//还没有写..
					break;
			}
		}
	},


}

module.exports = articleController