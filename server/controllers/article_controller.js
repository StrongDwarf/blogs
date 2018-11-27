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
 * @param {String:add|remove} type
 * @param {tags:Array,id:String} article 
 * @param {true|false} return
 */
function updateTagClassify(type, article) {
	console.log(article);
	const tags = article.tags;
	if (!tags) { return }
	let o = {
		'id': article.id,
	}
	console.log('o', o);
	TagClassify.findOne({})
		.exec(function (err, tcf) {
			if (err) { console.log(err) }
			console.log('tcf', tcf);
			console.log('tags', tags);
			if (type == 'add') {
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
			} else if (type == 'remove') {
				for (let i = 0; i < tags.length; i++) {
					let tagIndex = tcf.childrens.findIndex((val) => {
						if (val['tag_name'] == tags[i]) {
							return true;
						}
						return false
					})
					if (tagIndex != -1) {
						let articleIndex = tcf.childrens[tagIndex].childrens.findIndex(val => {
							if (val['id'] == article.id) {
								return true;
							}
							return false
						})
						if (articleIndex != -1) {
							tcf.childrens[tagIndex]['count']--;
							tcf.childrens[tagIndex].childrens.splice(articleIndex, 1);
						}
					}
				}
			}
			let tc = new TagClassify(tcf);
			tc.save((err, tc) => {
				if (err) {
					console.log('Failed to update tagClassify table');
					console.log(err);
					return false;
				}
				console.log('Success to update tagClassify table');
				console.log(tc);
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
 * @param {String:add|remove} type
 * @param {time:Number,id:String} article 
 * @param {true|false} return
 */
function updateTimeClassify(type, article) {
	TimeClassify.findOne({}).exec(function (err, timecf) {
		if (err) { console.log(err) }
		if (type == 'add') {
			let date = new Date(+article.time);
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
			console.log('111', timecf);
		} else if (type == 'remove') {
			timecf = removeTimeClassify(timecf, +article.time, article.id);
		}
		console.log('222', timecf);
		let tc = new TimeClassify(timecf);
		tc.save(function (err, tc) {
			if (err) {
				console.log('Failed to update timeClassify table');
				console.log(err);
				return false;
			}
			console.log('Success to update timeClassify table');
			console.log(tc);
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


/**
 * remove article.id in timeClassify
 * 
 * @param {Array} childrens 
 * @param {Object} obj 
 * @param {Array} arr
 * @param {undefined} return
 */
function removeTimeClassify(timecf, time, id) {
	timecf.count--;
	let date = new Date(time);
	let yearIndex = timecf.childrens.findIndex((val) => {
		if (val.year == date.getFullYear()) {
			return true;
		}
		return false;
	})
	let year = timecf.childrens[yearIndex];
	year['count']--;
	let monthIndex = year.childrens.findIndex((val) => {
		if (val.month == date.getMonth() + 1) {
			return true;
		}
		return false;
	})
	let month = year.childrens[monthIndex];
	console.log('month', month);
	month['count']--;
	let dayIndex = month.childrens.findIndex((val) => {
		if (val.day == date.getDate()) {
			return true;
		}
		return false;
	})
	console.log('dayIndex', dayIndex);
	let day = month.childrens[dayIndex];
	console.log('day', day);
	day['count']--;
	let articleIndex = day.childrens.findIndex((val) => {
		if (val.id == id) {
			return true;
		}
		return false
	})
	day.childrens.splice(articleIndex, 1);
	return timecf;
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
		if(typeof req.body.data != 'object'){
			 data = JSON.parse(data);
		}
		let article = {
			'time': Number(Date.now()),
			'title': data.title,
			'signature': data.signature,
			'tags': data.tags,
			'article': data.article,
			'isSecret': false,
			'summary': getSummary(data.article)
		};
		const ac = new Article(article);
		ac.save(function (err, ac) {
			if (err) {
				console.log(err);
				res.status(500).json({
					error: true,
					message: '保存文章出错',
				}).end();
			}
			console.log('插入到文章表中成功');
			console.log(ac);
			updateTimeClassify('add', ac)
			updateTagClassify('add', ac)
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
		if (req.body.type) {
			switch (req.body.type) {
				//根据时间来获取文章列表
				case 'time':
					//查找时间早于req.body.time的数据
					Article.find({}, { 'title': 1, '_id': 1, 'summary': 1, 'tags': 1, 'time': 1, }).limit(20).lt('time', req.body.time)
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
					res.json({
						error: true,
						message: '错误type'
					}).end()
					break;
			}
		}
	},

	/**
	 * get timeClassify of tagClassify by the type of req.body
	 * 
	 * @param {String} req.body.type
	 */
	getClassify(req, res) {
		if (req.body.type) {
			switch (req.body.type) {
				case 'timeClassify':
					TimeClassify.findOne({}).exec((err, tc) => {
						if (err) {
							console.log(err);
							res.json({
								error: true,
								message: '查询timeClassify失败'
							}).end()
							return;
						}
						res.json({
							success: true,
							message: '查询timeClassify成功',
							timeClassify: tc
						}).end();
					})
					break;
				case 'tagClassify':
					TagClassify.findOne({}).exec((err, tc) => {
						if (err) {
							console.log(err);
							res.json({
								error: true,
								message: '查询tagClassify失败'
							}).end()
							return;
						}
						res.json({
							success: true,
							message: '查询tagClassify成功',
							tagClassify: tc
						}).end();
					})
					break;
				default:
					res.json({
						error: true,
						message: '错误type'
					}).end()
					return;
			}
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
				updateTagClassify('remove', ar);
				updateTimeClassify('remove', ar);
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