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

        }
      }
  getArticleList:
    {
      type: 0:根据时间获取 1:根据标签获取 2:根据搜索栏获取 3:
    }
}