const {UploadImage} = require('../../FunctionLibrary/FileLibrary');

const DefaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'

Page({
  data: {
		AvatarUrl:DefaultAvatarUrl
	},
  
  //登录
	async onLoad(options) 
	{
    //验证用户是否在Users表中存在
		const Res =  await wx.cloud.callFunction({
			name:'Login',
			data:{}
    });
    if(Res.result)
    {
      wx.switchTab({url: '/pages/Main/Main'});
    }else{
      wx.showToast({icon:'none',title: '第一次登录，请您注册登记一下'});
    }
	},

	HandleChooseAvatar(Result)
	{
		const {avatarUrl} = Result.detail;
		this.setData({
			AvatarUrl:avatarUrl
		});
	},

  //注册
	async Submit(Result)
	{
		const {UserName} = Result.detail.value;
    if(UserName!=='')
    {
      if(this.data.AvatarUrl === DefaultAvatarUrl)
      {
        wx.showToast({icon:'none',title: '头像不能为空',});
      }else
      {
        //上传头像，并返回文件Id
        let fileID = await UploadImage('UserAvatar',this.data.AvatarUrl);
        let userInfo={};
        userInfo.AvatarUrl = fileID;
        userInfo.UserName = UserName;

        wx.showLoading({title: '正在注册，请稍等',});
        await wx.cloud.callFunction({
          name:'AddUser',
          data:userInfo,
          success()
          {
            wx.hideLoading();
            wx.switchTab({url: '/pages/Main/Main'});
          },
          fail(err)
          {
            console.error(err);
            wx.hideLoading();
            wx.showToast({icon:'none',title: '注册登记失败，请稍后重试'});
          }
        });
      }
    }
    else
    {
      wx.showToast({icon:'none',title: '昵称不能为空'});
    }
	}
 
})