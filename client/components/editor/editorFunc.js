function MarkDownTree(obj){
    //初始化
    //获取一维数组
    this.getTextType.flag = 'normal';
    let arr = this.getTextArr(obj.el);
    let rootNode = this.getNode('root',obj);
    let nodeFather = rootNode;
    
    //将节点添加到树中。
    for(let i =0;i<arr.length;i++){
        let type = this.getTextType(arr[i].data);
        arr[i].data = formatTextData(type,arr[i].data);
        let node = this.getNode(type,arr[i]);
        if(node){
            nodeFather = this.addNodeToTree(nodeFather,node);
        }
    }

    //消除树节点中的圆环结构, 即请求所有节点中的father属性
    rootNode = this.removeCircle(rootNode);

    return rootNode;

    function formatTextData(type,data){
        switch(type){
            case 'h1':
                return data.split('#')[1];
                break;
            case 'h2':
                return data.split('##')[1];
                break;
            case 'h3':
                return data.split('###')[1];
                break;
            case 'h4':
                return data.split('####')[1];
                break;
            default:
                return data;
                break
        }
    }

}
MarkDownTree.prototype = {
    //获取一维数组格式的文本
    getTextArr(el){
        const arry = [];
        for(let item of el.childNodes){
            if(item.tagName == 'undefined'){
                continue;
            }
            let obj = {};
            if(item.tagName == 'IMG'){
                //obj.type = 'img';
                obj.data = item.src;
            }else{
                //obj.type = 'text';
                obj.data = item.innerHTML;
            }
            if(obj.data){
                arry.push(obj);
            }
        }
        return arry;
    },
    //对节点数据中的一些字符进行转义
    trans(text){
        return text.replace(/[&]/g, function(match, pos, originalText){
            switch(match){
            case "&" : return "~~";
        } 
        }); 
    },
    //根据输入的type和data获取节点
    getNode(type,data)
    {
        //定义根节点类
        function CreateTreeRoot(obj){
            this.title = obj.title || '';
            this.tags = obj.tags || '';
            this.isSecret = obj.isSecret || '';
            this.childrens = [];
            this.type = 'root';
        }
        
        //定义节点的公用方法
        const nodeFunc = {
            //在节点末尾添加子节点
            add(node){
                node.father = this;
                var a = [];
                a.push(node);
                this.childrens.push(node);
            },
            //在叶子节点末尾删除节点
            remove(node){
                node.father = null;
                this.childrens.pop(node);
            },
        }

        //叶子节点构造器
        function CreateBasicNode(type,data){
            this.type = type;
            this.data = data;
            //指向节点的父节点
            this.father = null;
        }
        //茎节点构造器
        function CreateStemNode(type,data){
            CreateBasicNode.call(this,type,data);
            this.childrens = [];
        }
        //茎节点原型方法
        CreateStemNode.prototype = nodeFunc;
        CreateTreeRoot.prototype = nodeFunc;
        CreateBasicNode.prototype = nodeFunc;
        
        const arr1 = ['h1','h2','h3','h4','code','ul'];
        const arr2 = ['p','codeline','li','img'];
        //根据节点type的不同返回不同的对象
        if(type == 'root'){
            return new CreateTreeRoot(data);
        }
        else if(arr1.indexOf(type) != -1)
        {
            return new CreateStemNode(type,this.trans(data.data));
        }
        else if(arr2.indexOf(type) != -1)
        {
            return new CreateBasicNode(type,this.trans(data.data));
        }
        else
        {
            //无法匹配的节点.不创建节点
            return;
        } 
    },
    //输入文本，返回文本类型
    getTextType(text1)
    {
        //先除去文本两边的空白
        let text = text1.trim();
        //先判断是不是img节点
        if(text.indexOf('data:image') != -1){
            return 'img'
        }
        //判断代码区域现在状态
        //正常状态.
        if(this.getTextType.flag == 'normal')
        {
            //检测h1,h2,h3,h4,
            if(text.slice(0,1) === '#'){
                if(text.slice(0,2) === '##'){
                    if(text.slice(0,3) === '###'){
                        if(text.slice(0,4) === '####'){
                            return 'h4'
                        }
                        return 'h3'
                    }
                    return 'h2'
                }

                return 'h1'
            }
            
            //检测code start
            else if(text.indexOf('code') == 0 && text.slice(4,).trim().indexOf('start') == 0)
            {
                //代码段开始,置标志位为codefre
                this.getTextType.flag = 'code';
                return 'code'
            }

            //检测ul start
            else if(text.indexOf('ul') == 0 && text.slice(2,).trim().indexOf('start') == 0)
            {
                //ul 段开始，置标志位为ul
                this.getTextType.flag = 'ul';
                return 'ul'
            }
            else{
                return 'p';
            }
        }
        //区域属于代码段
        else if(this.getTextType.flag == 'code')
        {
            if(text.indexOf('code') ==0 && text.slice(4,).trim().indexOf('end') == 0)
            {
                this.getTextType.flag = 'normal';
                //return 'code'
            }
            else
            {
                return 'codeline'
            }
        }
        else if(this.getTextType.flag == 'ul')
        {
            if(text.indexOf('ul') == 0 && text.slice(2,).trim().indexOf('end') == 0)
            {
                this.getTextType.flag = 'normal';
                //return 'ul'
            }
            else
            {
                return 'li'
            }
        }
    },
    //定义一个节点比较方式，
    //当type1>type2时返回true。
    addNodeToTree(nodeFather,node)
    {
        const arr1 = ['root','h1','h2','h3','h4','code','ul'];
        const arr2 = ['p','li','codeline','img'];
        nodeFather = getNodeFather();
        nodeFather.add(node);
        if(arr1.indexOf(node.type) != -1){
            nodeFather = node;
        }
        return nodeFather;

        function getNodeFather(){
            if(arr2.indexOf(node.type) != -1)
            {
                return nodeFather;
            }
            else if(arr1.indexOf(nodeFather.type) >= arr1.indexOf(node.type))
            {
                nodeFather = nodeFather.father;
                return getNodeFather(nodeFather,node);
            }
            else if(arr1.indexOf(nodeFather.type) < arr1.indexOf(node.type)){
                return nodeFather;
            }    
        }
    },
    removeCircle(rootNode){
        return setNodeToNull(rootNode);

        //深度遍历节点树上的所有节点,并将所有节点中的father节点置null,
        function setNodeToNull(node){
            if(node.childrens && node.childrens.length != 0){
                for(let i=0;i<node.childrens.length;i++){
                    setNodeToNull(node.childrens[i]);
                }
            }
            node.father = '';
            return node;
        }
    },
    //节点的一些通用方法
    nodeFunc:
    {
        //给节点添加子节点
        add(node){
            node.father = this;
            this.childrens.push(node);
        }
    },

}
const editorFunc = {
    getArticle(el){
        let obj = {
            'el':el,
        }
        return (new MarkDownTree(obj)).childrens
    }
}

export default editorFunc