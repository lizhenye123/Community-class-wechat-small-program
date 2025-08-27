const App = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    Classs:['全部'],
    CurrentSelectClass:'全部',
    Publishs:[],
    CurrentClassPublish:[],
    clickItemData:''
  },

  //打开页面时获取对应的文章
  async onLoad(options) 
  {
    //page里的Classs只有一个全部
    let TempClasss = this.data.Classs;
    //将全局数据中的 CatModule 合并到 Classs 中
    TempClasss = TempClasss.concat(App.globalData.CatModule);
    this.setData({Classs:TempClasss});
    let {result}  = await wx.cloud.callFunction({
      name:'GetPublishByModule',
      data:{Module:'猫咪'}
    });
    this.setData({Publishs:result,CurrentClassPublish:result});
  },
  HandleSelectClass(Event)
  {
    const {value} = Event.detail;
    this.setData({CurrentSelectClass:this.data.Classs[value]});
  },
  //打开点击的文章
  HandleOpenPublishClick(Event)
  {
    const {publish} = Event.target.dataset;
    this.setData({clickItemData:publish});
    wx.navigateTo({
      url: '/pages/Details/Details',
      success:({eventChannel})=>
      {
        eventChannel.emit('SetPublish',publish);
      }
    });
  }
})