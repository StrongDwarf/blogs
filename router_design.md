
##user
=> /home 
在主页中,用户可以查看,所有当前页的数据
该页中的功能有:
  导航条： 归档(按时间排列的博客信息)，  分类(按标签排列的博客信息)，关于(自我介绍和博客介绍), 收藏(自己收藏的其他博客)  搜索(可以按照关键字搜索博客)
  头部: 博客名， 个性签名 
  文章容器:
    子文章:文章名，文章标签,文章summary。
    点击子文章后，子文章页扩大,并且放大至全屏。 子文章中的内容变化至如下:
      文章名, 文章个性签名, 文章主体，文章评论， 并且在屏幕右上角显示目录标签.
      用户点击目录后显示文章结构.
    双击子文章后,子文章页缩小,再次回到首页。
  换页签。显示页面

=> /home
 => header-bar:小白菜的博客 fixed，top:0  height:53px;
   nav-menu: float:left, margin-left:2vw, click:height:40vw, slide-down, click-out:slide-up,
     li: click: scale-out,  click-out:scale-in
    归档:显示按时间排列的博客信息
    分类:按标签排列的博客信息
    问题:自问自答, 记录遇到的问题和问题答案。
    收藏:收藏的其他博客
    搜索:按关键字搜索博客
    关于:自我介绍和博客介绍




=>/xiaobaicai
登录页, 输入账号密码登录。
=> 博客管理首页,
  首页内容:
    header-bar: 小白菜的博客, 
    => 写博客，
      => 写新博客,
      =>tab:
        tab1:没发表的博客,
        tab2:已经发表了的博客
    => 跳转到博客编辑页
      => header-bar:小白菜的编辑器
      => input:title
      => input:signature
      => article-editor:article
      => tags-select:tags
      => secret-select:isSecret
      => submit(发表) save(保存)


data_table:
  admin:{
    id,
    account,
    pawd,
  }
  user:{
    id,
    account,
    pawd
  }
  article:{
    id,
    time,
    title,
    signature,
    article,
    tags,
    isSecret,
  },
  draft:{
    id,
    time,
    title,
    signature,
    article,
    tags,
    isSecret
  },
  timeClassify:{
    type:'root',
    count:'',
    childrens:[]
  },
  tagClassify:{
    type:'root',
    count:'',
    children:[]
  },


router_dataformat:{
  putArticle:
    {
      token
      data:{
        type: 0:save or 1:submit
        title:''
        signature:''
        article:''
        tags:[]
        isSecret:false or true
      }
    }
    return:
      {
        type:0:success, 1:error
        if(error){message}
      }
  updateArticle:
    {
      token
      article_id
      //其他的和上面的一样
    }
    return:
      {
        type:0:success,1:error
        if(error){message}
      }
  getArticle:
    {
      article_id
    }
    return:
      {
        article_data:{
          article_id
          article_time
          article_title
          article_signature
          article_article
          article_tags
          article_isSecret
        }
      }
  getArticleList:
    {
      type: 0:根据时间获取 1:根据标签获取 2:根据搜索栏获取 3:
      if(type === 3){message}
    }
    return:
      //time,tags,search
      {
        article_list_data:[{
            article_id,
            article_time,
            article_tags,
            article_summary
          },{
            article_id,
            article_time,
            article_tags,
            article_summary
          },]
      }
  //获取归档
  getclassify:
    {
      type: 0:获取时间归档, 1:获取标签归档
    }
    return:
    //TimeClassify
      {
        type:'root',
        count:'',
        childrens:[{
          year:'2018',
          count:'',
          childrens:[{
            count:'',
            month:'12',
            childrens:[{
              count:'',
              day:'29',
              childrens:[{
                article_id:''
              }]
            },{
              day:'29',
              count:'',
              childrens:[{
                article_id:''
            }]
          }]
        }]
      }
    //TagsClassify
      {
        type:'root',
        count:'',
        childrens:[{
          tag_name:'',
          count:'',
          childrens:[{
            article_title:'',
            article_id:'',
            article_tags:'',
            article_summary:''
          }]
        },{
          tag_name:'',
          count:'',
          childrens:[{
            article_title:'',
            article_id:'',
            article_tags:'',
            article_summary:'',
          }]
        }]
      }
  
  
}