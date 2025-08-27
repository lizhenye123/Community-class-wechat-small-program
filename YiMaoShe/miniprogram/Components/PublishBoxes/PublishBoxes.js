const {IsLike,DBTimeToString} = require('../../FunctionLibrary/FileLibrary');

Component({

  /**
   * 组件的属性列表
   */
  properties: {
    Publish:{type:Object,value:{},observer(Event)
    {
      //console.log(Event);
    },}
  },

  /**
   * 组件的初始数据
   */
  data: {
    UserInfo:{},
    Content:'',
    PublishTime:'',
    ImageList:[],
    LikeIconUrl:'',
    bIsVideo:false,
    LikeUsers:[],
    CommentUsers:[],
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //文章的发布时间
    async InitPublishTime()
    {
      const TempPublishTime= this.properties.Publish.PublishTime;
      let TempTime = DBTimeToString(TempPublishTime);
      this.setData({PublishTime:TempTime});
    },
    //当前用户点赞了吗
    async InitCurrentUserLike()
    {
      let {result} = await wx.cloud.callFunction({
        name:'GetCurrentOpenId',
        data:{}
      });
      let TempLikeUrl = IsLike(this.data.LikeUsers.LikeUsers,result.openid)
      this.setData({LikeIconUrl:TempLikeUrl});
    },
    //从详情页面出来 更新一下评论和点赞
    async UpdatePublishMessage()
    {
      let LikeResult = await wx.cloud.callFunction({
        name:'GetLikeById',
        data:{LikeId:this.properties.Publish.LikeId}
      });

      let CommentResult = await wx.cloud.callFunction({
        name:'GetCommentById',
        data:{CommentId:this.properties.Publish.CommentId}
      });

      this.setData({
        LikeUsers:(await LikeResult).result[0],
        CommentUsers:(await CommentResult).result[0],
      });
    }
  },
  lifetimes:{
    //标签+数据+属性都完事了
    async ready()
    {
     let {result} = await wx.cloud.callFunction({
        name:'GetUserByOpenId',
        data:{UserID: this.properties.Publish._openid}
      });
      let TempUser={};
      TempUser.UserName = result[0].UserName;
      TempUser.AvatarUrl = result[0].AvatarUrl;
      this.setData({UserInfo:TempUser});

      await this.InitPublishTime();
      
      let TempContent=this.properties.Publish.Content;
      if(TempContent.length>30)
      {
        TempContent = TempContent.substring(0, 30) + '...';
      }

      this.setData({
        Content:TempContent,
        ImageList:this.properties.Publish.ImageList.slice(0,3),
        bIsVideo:this.properties.Publish.Video.length,
      });
      await this.UpdatePublishMessage();
      await this.InitCurrentUserLike();
    }
  },
  pageLifetimes: 
  {
    async show() 
    {
      await this.UpdatePublishMessage();
      await this.InitCurrentUserLike();
    },
  },
})