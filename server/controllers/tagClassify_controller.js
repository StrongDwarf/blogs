require('../models/tagClassify_model.js');
const mongoose = require('mongoose');
const TagClassify = mongoose.model('TagClassify');

let tags = null;    //设置一个tags缓存

const tagClassifyController = {
    /**
     * update tagClassify  in database
     * Called when inserting new data into the article table
     * 
     * @param {String:add|remove} type
     * @param {tags:Array,id:String} article 
     * @param {true|false} return
     */
    updateTagClassify(type, article) {
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
    },

    getTags(req, res) {
        console.log('收到请求');
        if (!tags) {
            TagClassify.findOne({}).exec((err, tc) => {
                if (err) {
                    console.log(err);
                    res.json({
                        error: true,
                        message: '查找TagClassify发生错误'
                    }).end();
                    return;
                }
                let childrens = tc.childrens;
                tags = [];
                for (let i = 0; i < childrens.length; i++) {
                    tags.push(childrens[i]['tag_name']);
                }
                res.json({
                    success: true,
                    message: '查询tagclassify成功',
                    tags: tags
                }).end();
            })
        }else{
            console.log(tags);
            res.json({
                success: true,
                message: '查询tagclassify成功',
                tags: tags
            }).end();
        }
        
    },

    getTagClassify(req,res){
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
    }
}

module.exports = tagClassifyController