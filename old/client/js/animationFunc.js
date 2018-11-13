/**
 * animation.js
 * 保存页面中需要用到的炫酷的效果。
 */
(function(window){
    window.AnimationFunc = {
        toTopExecFunc(el1,el2,el3){
            const headerName        =  el1;     //document.getElementsByClassName('content-header-name')[0];
            const headerSignature   = el2;      //document.getElementsByClassName('content-header-signature')[0];
            const pad1              = el3;      //document.getElementById('pad1');
            const nameTop           = headerName.getBoundingClientRect().top;
            const nemeBottom        = headerName.getBoundingClientRect().bottom;
            const signatureTop      = headerSignature.getBoundingClientRect().top;
            const signatureBottom   = headerSignature.getBoundingClientRect().bottom;
            let   nameIsTop         = false;    //判断时间流元素是否在顶端
    
            var scrollFunc = function (e) {
                e = e || window.event;
                if (e.wheelDelta) {                     //第一步：先判断浏览器IE，谷歌滑轮事件    
                    if (e.wheelDelta < 0) 
                    {             //当滑轮向下滚动时
                      
                        if(!nameIsTop && document.body.scrollTop >= nameTop){
                            nameToTopFunc(); 
                        }
                        if(document.body.scrollTop >= signatureTop){
                            pad1.style.height = '53px';
                        }
                    }
                    else
                    {
                        if(nameIsTop && document.body.scrollTop <= nameTop){
                            console.log('启动nameInit动画');
                            nameIsTop = false;
                        }
                    }
                } else if (e.detail) { //Firefox滑轮事件 
                    if (e.detail > 0) { //当滑轮向上滚动时 
                        console.log("滑轮向上滚动");
                    }
                    if (e.detail < 0) { //当滑轮向下滚动时 
                        
                        console.log("滑轮向下滚动");
                    }
                }
            }
            //给页面绑定滑轮滚动事件 
            if (document.addEventListener) {//firefox 
                document.addEventListener('DOMMouseScroll', scrollFunc, false);
            }
            //滚动滑轮触发scrollFunc方法 //ie 谷歌 
            window.onmousewheel = document.onmousewheel = scrollFunc;
    
            //时间流元素到达顶部时执行的函数
            function nameToTopFunc() {
                headerName.classList.add('nameToTop');
                pad1.style.height = '42vw';
                //headerSignature.style.display = 'none';
                nameIsTop = true;
                setTimeout(function(){
                    const menu      = document.createElement('div');
                    menu.style      = "background-color:#222222;background-size:100% 100%;background-image:url('./image/svg/menu.svg');";
                    menu.classList.add("showMenu");
                    headerName.appendChild(menu);
                },610)
            }
        }
    }
})(window)