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

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) 
  {
    let TempClasss = this.data.Classs;
    TempClasss = TempClasss.concat(App.globalData.CatFoodModule);
    this.setData({Classs:TempClasss});
    let {result}  = await wx.cloud.callFunction({
      name:'GetPublishByModule',
      data:{Module:'猫粮'}
    });
    this.setData({Publishs:result,CurrentClassPublish:result});
  },
  HandleSelectClass(Event)
  {
    const {value} = Event.detail;
    this.setData({CurrentSelectClass:this.data.Classs[value]});
  },
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