require('../models/article_model.js');
require('../models/tagClassify_model.js');
require('../models/timeClassify_model.js');
const mongoose = require('mongoose');
const Article = mongoose.model('Article');
const TagClassify = mongoose.model('TagClassify');
const TimeClassify = mongoose.model('TimeClassify');

function getSummary(data) {
	let str = '';
	for (let i = 0; i < data.childrens.length; i++) {
		str += data.childrens[i].data;
		if (str.length > 80) {
			break;
		}
	}
	return str;
}

const Time = {
	getYear(number){
		return (new Date(number)).getFullYear()
	}
}

//初始化TagClassify表和TimeClassify表
function init() {
	TagClassify.find({})
		.exec(function (err, TC) {
			if (err) { console.log(err) }
			if (TC && TC.length >= 1) {
				console.log('已存在TagClassify表');
				console.log(TC);
				return
			}
			else {
				//创建一条TagClassify记录
				let tagClassify = {};
				tagClassify.type = 'root';
				tagClassify.count = 0;
				tagClassify.childrens = [];
				//查找所有的article记录
				Article.find({})
					.exec((err, articleList) => {
						if (err) { console.log(err) }
						//遍历所有article数据
						for (let i = 0; i < articleList.length; i++) {
							//创建子article,用于后续的压栈
							let tem = {
								'article_title':articleList[i].title,
								'article_time':articleList[i].time,
								'article_id':articleList[i].id,
								'article_summary':articleList[i].summary
							};
							//console.log(tem);
							//遍历每个article的tag数据
							for (let tag of articleList[i].tags) {
								//在tagClassify中找到该tag对应的object
								let flag = false;  //设置一个标志
								for (let i = 0; i < tagClassify.childrens.length; i++) {
									if (tagClassify.childrens[i].tag_name == tag) {
										tagClassify.childrens[i].count++;
										//创建新节点
										tagClassify.childrens[i].childrens.push(tem);
										//找到tag对应的元素，标志置true
										flag = true;
										break;
									}
								}
								if (!flag) {
									let o = {
										'tag_name':tag,
										'count':1,
										'childrens':[]
									}
									o.childrens.push(tem);
									tagClassify.childrens.push(o);
								}
							}
							tagClassify.count++
						}
					})
					//console.log(tagClassify);
				//创建一条tagclassify记录
				
				let tc = new TagClassify(tagClassify);
				
				tc.save((err,tc) => {
					if(err){console.log(err)}
					console.log(tc);
					return;
				})
				
			}
		})

		/*
	TimeClassify.find({})
		.exec((err,TimeC) => {
			if(err){console.log(err)}
			if(TimeC && TimeC.length >= 1){
				console.log('已存在TimeClassify表');
				console.log(TimeC);
			}
			else
			{
				//创建一条TimeC记录
				let timeClassify = {};
				timeClassify.type = 'root';
				timeClassify.count = 0;
				timeClassify.childrens = [];
				//查找所有的article记录,按照时间大小排序从大到小排序
				Article.find({}).sort({'time':1})
					.exec((err,articleList) => {
						if(err){console.log(err)}
						//设置当前检索到的年月日
						const n = new Date();
						let year = n.getFullYear();
						let month = n.getMonth() + 1;
						let day = n.getDate();

					})

			}
		})
		*/
}
//init()


const articleController = {
	putArticle(req, res) {
		let data = JSON.parse(req.body.data);
		let ac = new Article({ 'time': (new Date()).getTime() + '' });
		ac.set('type', data.type);
		ac.set('signature', data.signature);
		ac.set('title', data.title);
		ac.set('isSecret', false);
		ac.set('summary', getSummary(data));
		ac.set('tags', data.tags);
		ac.set('childrens', data.childrens);
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
		})
	},
	getArticle(req,res) {
		if(req.body.article_id){
			Article.findOne({'_id':req.body.data.article_id})
				.exec((err,article) => {
					if(err){
						console.log(err);
						res.json({'type':1})
						res.end();
					}
					res.json({'type':0,'data':article})
					res.end();
				})
		}
	},
	getArticleList(req,res){
		if(req.body.type){
			switch(req.body.type){
				//根据时间来获取文章列表
				case '0':
					//查找时间早于req.body.time的数据
					Article.find({},{'title':1,'_id':1,'time':1,}).limit(10).lt('time',req.body.time)
						.exec((err,articleList) => {
							if(err){
								console.log(err);
								res.json({'type':1})
								res.end();
							}
							res.json({'type':0,'data':JSON.stringify(articleList)})
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