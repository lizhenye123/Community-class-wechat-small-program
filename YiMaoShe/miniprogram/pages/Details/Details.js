const {DBTimeToString,IsLike,SwitchLikeIcon} = require('../../FunctionLibrary/FileLibrary');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    Publish:{
      _id:'',
      CommentId:'',
      Content:'',
      ImageList:[],
      LikeId:'',
      Location:{LocationName:''},
      ModuleSelectClass:'',
      PublishModule:'',
      PublishTime:'',
      Video:'',
      _openid:''
    },
    UserInfo:{},
    PublishTime:'',
    LikeIconUrl:'',
    Likes:{},
    Comments:{},
    CurrentOpenId:'',
    //记录下他点喜欢了没
    bInitLike:false,
    //决定数据库 要不要 给User里加这个文章  0表示不管，-1表示删除，1表示添加
    AddOrRemove:0,
  },

  async onLoad(options) 
  {
    //接受传递过来的文章信息
    const Event = this.getOpenerEventChannel();
    await Event.on('SetPublish', async(publish)  =>
    {
      //储存文章信息
      this.setData({Publish:publish});
      //获取UserInfo信息
      let User = await wx.cloud.callFunction({
        name:'GetUserByOpenId',
        data:{UserID: this.data.Publish._openid}
      });
  
      let TempTime=DBTimeToString(this.data.Publish.PublishTime);
      this.setData({UserInfo:User.result[0],PublishTime:TempTime});
    });
    await this.LoadLikeAndComment();
  },
  //初始化点赞和评论信息
  async LoadLikeAndComment()
  {
    //通过LikeId获取这个文章的Like信息
    let Like = await wx.cloud.callFunction({
      name:'GetLikeById',
      data:{LikeId:this.data.Publish.LikeId}
   });
   //通过CommentId获取这个文章的Comment信息
   let Comment = await wx.cloud.callFunction({
      name:'GetCommentById',
      data:{CommentId:this.data.Publish.CommentId}
    });

    let TempLikUsers = Like.result[0];
    let TempComment = Comment.result[0];
    let TempLikeUrl='../../images/Common/Unlike.png';
    //获取当前用户的_openid
    let {result} = await wx.cloud.callFunction({name:'GetCurrentOpenId',data:{}});
    //判断用户点赞了吗,点赞返回点赞的Icon,没点赞就显示上面的初始化变量时的图片
    if(TempLikUsers !== undefined)
    {
      TempLikeUrl = IsLike(TempLikUsers.LikeUsers,result.openid)
    }
    
    this.setData({
      LikeIconUrl:TempLikeUrl,
      Likes:TempLikUsers,
      Comments:TempComment,
      CurrentOpenId:result.openid,
    });
  },
  HandleThisImage(Event)
  {
    let Index = Event.currentTarget.dataset.imageid;
    let TempList = this.data.Publish.ImageList;
    wx.previewImage({
      urls: TempList,
      current:TempList[Index],
    });
  },
  async HandleLikeClick(Event)
  {
    let TempLikeUrl = SwitchLikeIcon(this.data.LikeIconUrl);
    this.setData({LikeIconUrl:TempLikeUrl.LikeUrl,bInitLike:true});

    if(TempLikeUrl.bLike)
    {
      let TempLikes = this.data.Likes;
      wx.cloud._openid
      TempLikes.LikeUsers.push(this.data.CurrentOpenId);
      this.setData({Likes:TempLikes,AddOrRemove:1});
      
    }else
    {
      let TempLikes = this.data.Likes;
      const UpdatedLikeUsers = TempLikes.LikeUsers.filter(item => item !== this.data.CurrentOpenId);
      TempLikes.LikeUsers = UpdatedLikeUsers;
      this.setData({Likes:TempLikes,AddOrRemove:-1});
    }
    
  },
  //进入评论页面
  HandleCommentClick(Event)
  {
    wx.navigateTo({
      url: 'Comment/Comment',
      success:({eventChannel})=>
      {
        eventChannel.emit('SetComments',this.data.Comments);
      }
    })
  }, 
  onUnload(Event)
  {
    this.UploadLikeMessage();
  },
  onShow(Event)
  {
    this.LoadLikeAndComment();
  },
  onHide(Event)
  {
    this.UploadLikeMessage();
  },
  //更新点赞信息
  UploadLikeMessage()
  {
    //离开时判断用户是不是点过点赞按钮，点过就更新数据库
    if(this.data.bInitLike)
    {
      let This = this;
      wx.cloud.callFunction({
        name:'UpdateLike',
        data:{
          LikeId:This.data.Likes._id,
          LikeUsers:This.data.Likes.LikeUsers,
          AddOrRemove:This.data.AddOrRemove,
          PublishId:This.data.Publish._id,
        }
      });
    }
  },
  //进入Report页面
  HandleReportClick(Event)
  {
    const This = this;
    wx.navigateTo({
      url: '/pages/Details/Report/Report',
      success({eventChannel})
      {
        eventChannel.emit('ReportPublish',This.data.Publish._id);
      }
    });
  }
 
})
