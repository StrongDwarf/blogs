/**
 * Ajax函数:
 * Ajax.get(url,callback);
 * Ajax.post(url,data,callback);
 *  其中,url:为字符串,  data为JSON格式.  callback::Function
 */

(function(window){
    window.Ajax = {
        get(url,callback){
            let xhr = new XMLHttpRequest();
            xhr.open('get',url,true);
            xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded")
            xhr.send();
            xhr.onreadystatechange = function()
            {
                if(xhr.readyState == 4 && xhr.status == 200)
                {
                    //console.log(ajax.responseText);  //输入相应的内容
                    callback(xhr.responseText);
                }
            }
        },
        post(url,data,callback){
            let xhr = new XMLHttpRequest();
            xhr.open('post',url,true);
            xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
            //xhr.send('data='+JSON.stringify(data));
            //var fd = new FormData();
            //fd.append("data",'111');
            //fd.append("people",'userid');
            //fd.append("ck",'ck');
            xhr.send('data='+JSON.stringify(data));
            xhr.onreadystatechange = function()
            {
                if(xhr.readyState == 4 && xhr.status ==200)
                {
                    callback(xhr.responseText);
                }
            }
        }

    }
})(window)