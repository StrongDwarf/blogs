require('../models/draft_model.js');

const mongoose = require('mongoose');
const Draft = mongoose.model('Draft');
const articleController = require('./article_controller.js');

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

const draftController = {
    putDraft(req, res) {
        if(!req.body.data){
            res.json({
                error:true,
                message:'数据格式错误'
            }).end();
            return;
        }
        const data = JSON.parse(req.body.data);
        let draft = {
            'time': Number(Date.now()),
            'title': data.title,
            'signature': data.signature,
            'tags': data.tags,
            'article': data.article,
            'isSecret': false,
            'summary': getSummary(data.article)
        };
        const ac = new Draft(draft);
        ac.save(function (err, ac) {
            if (err) {
                console.log(err);
                res.json({
                    error: true,
                    message: '保存草稿出错',
                }).end();
            }
            console.log('插入草稿表成功');
            console.log(ac);
            res.json({
                success: true,
                message: '保存草稿成功',
                id: ac.id
            }).end();
        })
    },

    getDraft(req, res) {
        if (!req.body.id) {
            res.json({
                error: true,
                message: '数据格式错误'
            }).end();
            return;
        }
        Draft.findOne({ '_id': req.body.id })
            .exec((err, draft) => {
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
                    draft: draft
                }).end();
            })
    },

    getDraftList(req, res) {
        if (!req.body.time) {
            res.json({
                error: true,
                message: '数据格式错误',
            }).end()
            return
        }
        Draft.find({}, { 'title': 1, '_id': 1, 'summary': 1, 'tags': 1, 'time': 1, }).limit(10).lt('time', req.body.time)
            .exec((err, draftList) => {
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
                    draftList: draftList
                }).end();
            })
    },

    convertArticle(req,res){
        if(!req.body.id){
            res.json({
                error:true,
                message:'数据格式错误'
            }).end();
            return;
        }
        Draft.findOne({'_id':req.body.id}).exec((err,draft) => {
            if(err){
                console.log(err);
                res.json({
                    error:true,
                    message:'查询过程中发生错误'
                }).end();
                return;
            }
            req.body.data = draft;
            draft.remove((err)=>{
                if(err){
                    console.log(err);
                    res.json({
                        error:true,
                        message:'删除草稿过程中发生错误'
                    }).end();
                    return;
                }
            })
            articleController.putArticle(req,res);
        })
    }
}

module.exports = draftController