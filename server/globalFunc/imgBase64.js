var fs = require('fs');

const imgBase64 = {
    base64ToImg(data) {
        //console.log(data);
        var path = './public/image/' + Date.now() + '.png';//从app.js级开始找--在我的项目工程里是这样的
        var base64 = data.replace(/^data:image\/\w+;base64,/, "");//去掉图片base64码前面部分data:image/png;base64
        base64 = base64.replace(/\s/g,"+");
        var dataBuffer = new Buffer(base64, 'base64'); //把base64码转成buffer对象，
        //console.log('dataBuffer是否是Buffer对象：' + Buffer.isBuffer(dataBuffer));
        fs.writeFile(path, dataBuffer,{flag:'w+'}, function (err) {//用fs写入文件
            if (err) {
                console.log(err);
            } else {
                console.log('写入成功！');
            }
        })
        let staticPath = 'http://localhost:8083'+path.slice(1);
        return staticPath
    }
}

module.exports =  imgBase64