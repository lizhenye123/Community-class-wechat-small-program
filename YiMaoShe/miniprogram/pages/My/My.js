const {DBTimeToString} = require('../../FunctionLibrary/FileLibrary');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    Module:[
      {Title:'我的文章',OpenUrl:'/pages/My/MyPublish/MyPublish'},
      {Title:'喜欢的文章',OpenUrl:'/pages/My/LikePublish/LikePublish'},
      {Title:'投诉建议',OpenUrl:'/pages/My/Suggest/Suggest'},
      {Title:'关于平台',OpenUrl:'/pages/My/Platform/Platform'},
    ],
    UserInfo:{},
  },

  //获取用户基础信息
  async onLoad(options) 
  {
     let {result} = await wx.cloud.callFunction({
      name:'GetCurrentUser',
      data:{}
    });
    let TempUserInfo ={};
    TempUserInfo.UserName = result[0].UserName;
    TempUserInfo.UserAvatar = result[0].AvatarUrl;
    TempUserInfo.LikePublishs = result[0].LikePublishs;
    TempUserInfo.RegisterTime = DBTimeToString(result[0].RegisterTime);
    TempUserInfo._openid = result[0]._openid;
    this.setData({UserInfo:TempUserInfo});
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow() 
  {
    
  },
  HandleModuleClick(Event)
  {
    const OpenUrl = Event.target.dataset.openurl;
    let _this = this;
    wx.navigateTo({
      url: OpenUrl.OpenUrl,
      success({eventChannel})
      {
      }
    })
  }

})