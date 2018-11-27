require('../models/timeClassify_model.js');
const mongoose = require('mongoose');
const TimeClassify = mongoose.model('TimeClassify');

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

const timeClassifyController = {
    /**
     * update timeClassify  in database
     * Called when inserting new data into the article table
     * 
     * @param {String:add|remove} type
     * @param {time:Number,id:String} article 
     * @param {true|false} return
     */
    updateTimeClassify(type, article) {
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
    },
    getTimeClassify(req,res){
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
    }
}

module.exports = timeClassifyController