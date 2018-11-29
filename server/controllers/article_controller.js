require('../models/article_model.js');
require('../models/draft_model.js');
const mongoose = require('mongoose');
const Article = mongoose.model('Article');
const tagClassify = require('./tagClassify_controller.js');
const timeClassify = require('./timeClassify_controller.js');
const imgBase64 = require('../globalFunc/imgBase64');
const fileWrite = require('../globalFunc/fileWrite');

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
/*
require('../models/tagClassify_model');
require('../models/timeClassify_model');
const TagClassify = mongoose.model('TagClassify');
const TimeClassify = mongoose.model('TimeClassify');
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
init()
*/
function conversionData(data){
	if(typeof data == 'string'){
		data = data.replace(/￥￥/g,'+');
		data = data.replace(/~~/g,'&');
		return data
	}else{
		data = JSON.stringify(data);
		data = data.replace(/￥￥/g,'+');
		data = data.replace(/~~/g,'&');
		data = JSON.parse(data);
		return data;
	}
}

function articleImgBase64ToPath(article){
	for(let i =0;i<article.length;i++){
		if(article[i].type == 'img'){
			article[i].data = imgBase64.base64ToImg(article[i].data);
		}
		if(article[i].childrens){
			articleImgBase64ToPath(article[i].childrens);
		}
	}
	return article
}

const articleController = {

	/**
	 * put article
	 * 
	 * @param {Object:{data:{type,title,signature,tags,article}}} req.body 
	 * @param {JSON:{success|error,message,id}} res 
	 */
	putArticle(req, res) {
		if (!req.body.data) {
			res.json({
				error: true,
				message: '数据格式错误'
			}).end();
			return;
		}
		let data = req.body.data
		if (typeof req.body.data != 'object') {
			data = JSON.parse(data);
		}
		data.article = conversionData(data.article);
		let article = {
			'time': Number(Date.now()),
			'title': data.title,
			'signature': data.signature,
			'tags': data.tags,
			'article': articleImgBase64ToPath(data.article),
			'isSecret': false,
			'summary': getSummary(data.article)
		};

		fileWrite.writeFile(article);
		const ac = new Article(article);
		ac.save(function (err, ac) {
			if (err) {
				console.log(err);
				res.status(500).json({
					error: true,
					message: '保存文章出错',
				}).end();
			}
			timeClassify.updateTimeClassify('add', ac)
			tagClassify.updateTagClassify('add', ac)
			res.json({
				success: true,
				message: '发布文章成功',
				id: ac.id
			}).end()
		})
		

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
						res.json({
							error: true,
							message: '查询文章失败',
						}).end();
					}
					res.json({
						success: true,
						message: '查询文章成功',
						article: article
					}).end();
				})
		}
	},

	/**
	 * get articleList by time or idList
	 * if time: You will get 20 articles in the latest time later than a;
	 * if idList: You will get data matching ID with idList.
	 * 
	 * @param {String:mode:,time|idList} req.body
	 * @param {success|err,ArrayList} res 
	 */
	getArticleList(req, res) {
		switch (req.body.type) {
			//根据时间来获取文章列表
			case 'time':
				//查找时间早于req.body.time的数据
				Article.find({}, { 'title': 1, '_id': 1, 'summary': 1, 'tags': 1, 'time': 1, }).sort({id:-1}).limit(10).lt('time', req.body.time)
					.exec((err, articleList) => {
						if (err) {
							console.log(err);
							res.json({
								error: true,
								message: '查询文章列表失败'
							}).end();
							return;
						}
						res.json({
							success: true,
							message: '查询成功',
							articleList: articleList
						}).end();
					})
				break;
			//根据标签来获取文章列表
			case 'idList':
				//将ajax传递过来的idList(原本为String)转化成Array, 
				let idList = req.body.idList.split('"').filter((val, index) => {
					if (index % 2 != 0) {
						return true
					} else {
						return false
					}
				})
				Article.find({ '_id': { '$in': idList } }, { 'title': 1, '_id': 1, 'summary': 1, 'tags': 1, 'time': 1, })
					.exec((err, articleList) => {
						if (err) {
							console.log(err);
							res.json({
								error: true,
								message: '查询文章列表失败'
							}).end()
							return;
						}
						res.json({
							success: true,
							message: '查询成功',
							articleList: articleList
						}).end()
					})
				break;
			default:
				Article.find({}, { 'title': 1, '_id': 1, 'summary': 1, 'tags': 1, 'time': 1, }).sort({_id:-1}).limit(10).lt('time', Date.now())
					.exec((err, articleList) => {
						if (err) {
							console.log(err);
							res.json({
								error: true,
								message: '查询文章列表失败'
							}).end();
							return;
						}
						res.json({
							success: true,
							message: '查询成功',
							articleList: articleList
						}).end();
					})
				break;
		}

	},


	/**
	 * update article by id
	 * 
	 * @param {id,data} req.body
	 */
	updateArticle(req, res) {
		console.log(req.body);
		const data = JSON.parse(req.body.data);
		let article = {
			'title': data.title,
			'signature': data.signature,
			'tags': data.tags,
			'article': data.article,
			'isSecret': false,
			'summary': getSummary(data.article)
		};
		Article.findOneAndUpdate({ 'id': req.body.id })
			.exec((err, ar) => {
				if (err) {
					console.log(err);
					res.json({
						error: true,
						message: '更新过程中发生错误'
					}).end();
					return;
				}
				ar.set(article);
				ar.save((err, ar1) => {
					if (err) {
						console.log(err);
						res.json({
							error: true,
							message: '保存过程中发生错误'
						}).end();
						return;
					}
					res.json({
						success: true,
						message: '更新文章成功',
						article: ar1
					}).end();
				})
			})
	},

	/**
	 * remove article by id
	 * 
	 * @param {id} req.body
	 */
	removeArticle(req, res) {
		if (req.body.id) {
			Article.findOne({ '_id': req.body.id }).exec((err, ar) => {
				if (err) {
					console.log(err);
					res.json({
						error: true,
						message: '查找文章出错'
					}).end();
					return;
				}
				console.log(ar);

				//先更新timeClassify,tagClassify两张表
				tagClassify.updateTagClassify('remove', ar);
				timeClassify.updateTimeClassify('remove', ar);
				ar.remove((err) => {
					if (err) {
						console.log(err);
						res.json({
							error: true,
							message: '删除文章出错'
						}).end();
						return;
					}
					res.json({
						success: true,
						message: '删除文章成功'
					}).end();
					return;
				})

			})
		} else {
			res.json({
				error: true,
				message: '错误输入',
			}).end();
		}
	}
}

module.exports = articleController