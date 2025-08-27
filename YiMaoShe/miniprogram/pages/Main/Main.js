// pages/Main/Main.js
Page({

  /**
   * TODO:更新全局数据模块时，一定这也的更新
   */
  data: {
    SwiperPublicitys:[],
    Module:[
      {ModuleName:'猫咪',IconUrl:'/images/Module/Cat.png',OpenUrl:'/pages/Module/Cat/Cat'},
      {ModuleName:'猫粮',IconUrl:'/images/Module/CatFood.png',OpenUrl:'/pages/Module/CatFood/CatFood'},
      {ModuleName:'预防',IconUrl:'/images/Module/Medical.png',OpenUrl:'/pages/Module/Medical/Medical'},
      {ModuleName:'配种',IconUrl:'/images/Module/Breeding.png',OpenUrl:'/pages/Module/Breeding/Breeding'},
    ],
    Publishs:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) 
  {
    //从数据库，获取推广的图片和链接
    const res =  await wx.cloud.callFunction({name:'GetPublicitys',data:{}});
    this.setData({SwiperPublicitys:(await res).result});
    //加载今天的文章
    this.UpdatePublishMessage();
  },
  onShow() 
  {
    this.UpdatePublishMessage();
  },
  //打开广告
  HandlePublicityClick(Event)
  {
    const {openurl} = Event.target.dataset;
    if(openurl.length > 0)
    {
      //打开广告推荐的小程序
      wx.openEmbeddedMiniProgram({appId:openurl});
    }else
    {
      wx.showToast({icon:'none',title: '此广告位中的广告位空，访问失败。',mask:true,duration:2000});
    }
  },
  //打开选中的模块
  HandleOpenModuleClick(Event)
  {
    const {openurl} = Event.target.dataset;
    wx.navigateTo({
      url:openurl,
      success(Event){},
      fail(Error)
      {
        console.error(Error);
      }
    });
  },
  //打开选中的文章
  HandleOpenPublishClick(Event)
  {
    const {publish} = Event.target.dataset;
    wx.navigateTo({
      url: '/pages/Details/Details',
      success:({eventChannel})=>
      {
        eventChannel.emit('SetPublish',publish);
      }
    });
  },
  async UpdatePublishMessage()
  {
    //TODO:测试阶段,只拉五篇,发版取消
    const Result = wx.cloud.callFunction({
      name:'MainGetPublishs',
      data:{PublishsCount:5}
    });
    this.setData({Publishs:(await Result).result})
  }
})