require('../models/article_model.js');
require('../models/draft_model.js');
require('../models/tagClassify_model.js');
require('../models/timeClassify_model.js');
const mongoose = require('mongoose');
const Article = mongoose.model('Article');
const Draft = mongoose.model('Draft');
const TagClassify = mongoose.model('TagClassify');
const TimeClassify = mongoose.model('TimeClassify');


function getSummary(data) {
	let str = '';
	console.log(data.article);
	console.log(data.article.length);
	for (let i = 0; i < data.article.length; i++) {
		str += data.article[i].data;
		if (str.length > 80) {
			break;
		}
	}
	return str;
}


//初始化TagClassify表和TimeClassify表
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


//文章插入到文章表后，更新标签表
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
				let hasTag = false;	  //设置一个标记,如果在TagClassify中找到了tag。则置true
				for (let j = 0; j < tcf[0].childrens.length; j++) {
					if (tcf[0].childrens[j].tag_name == tags[i]) {
						hasTag = true;
						tcf[0].childrens[j].count++;
						tcf[0].count++;
						tcf[0].childrens[j].childrens.push(o);
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
					tcf[0].count++;
					tcf[0].childrens.push(children);
				}
			}

		})
}

var article = {
	tags: ['a', 'b'],
	id: '123456'
}

updateTagClassify(article);


//文章插入到文章表后，更新TimeClassify表
function updateTimeClassify(article) {
	TimeClassify.findOneAndUpdate({}).exec(function (err, timecf) {
		if (err) { console.log(err) }
		//比较这篇文章的发表的时间和上次发表文章的时间相差多少
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
			if (err) { console.log(err) }
			console.log('插入数据库');
			console.log(timecf);
		})
	})
}

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
			return testData.apply(this, [childrens[childrens.length - 1].childrens, obj, arr])
		}
	}
	//childrens[childrens.length-1].childrens.push(obj);
	childrens.push(obj);
}



const articleController = {
	putArticle(req, res) {

		const data = JSON.parse(req.body.data);
		let article = {
			'time': Date.now(),
			'title': data.title,
			'signature': data.signature,
			'tags': data.tags,
			'article': data.article,
			'isSecret': false,
			'summary': getSummary(data)
		};

		//type为0,表示是保存, 则放在草稿表中
		if (data.type == '0') {
			const ac = new Draft(article);
			ac.save(function (err, ac) {
				if (err) { console.log(err) }
				console.log('插入到草稿表成功');
				console.log(ac);
			})
		}
		else if (data.type == '1') {
			const ac = new Article(article);
			ac.save(function (err, ac) {
				if (err) { console.log(err) }
				console.log('插入到文章表中成功');
				console.log(ac);
				//插入文章表后，更新timeclassify表和tagclassify表
				updateTimeClassify(ac)
			})
		}

		console.log(article);

		/*
		let data = JSON.parse(req.body.data);
		let ac = new Article({ 'time': (new Date()).getTime() + '' });
		ac.set('type', data.type);
		ac.set('signature', data.signature);
		ac.set('title', data.title);
		ac.set('isSecret', false);
		ac.set('summary', getSummary(data));
		ac.set('tags', data.tags);
		ac.set('article', data.article);
		ac.save(function (err, ac) {
			if (err) {
				console.log('插入数据库出错');
				console.log(err);
				res.json({'type':1})
				res.end()
			}
			console.log(ac);
			res.json({'type':0})
			res.end();
		})*/
	},
	getArticle(req, res) {
		if (req.body.article_id) {
			Article.findOne({ '_id': req.body.data.article_id })
				.exec((err, article) => {
					if (err) {
						console.log(err);
						res.json({ 'type': 1 })
						res.end();
					}
					res.json({ 'type': 0, 'data': article })
					res.end();
				})
		}
	},
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