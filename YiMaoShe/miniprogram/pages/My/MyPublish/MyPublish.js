const App = getApp();
Page({
  data: {
    MainModule:['全部','猫咪','猫粮','预防','配种'],
    Publishs:[],
    CurrentPublishs:[],
    CatModule:[],
    CatFoodModule:[],
    MedicalModule:[],
    BreedingModule:[],
    CurrentSelectModuleIndex:0,
    SelectStyle:{Color:'#1890FF',TabColor: '#333' || '#20ACAB'}
  },

  //获取用户发布的文章,并且分类
  async onLoad(options) {
    const Result = wx.cloud.callFunction({
      name:'GetUserPublishs',
      data:{}
    });
    this.setData({Publishs:(await Result).result});
    this.setData({CurrentPublishs:this.data.Publishs});
    this.data.Publishs.forEach(element => {
      switch(element.PublishModule)
      {
        case '猫咪': this.data.CatModule.push(element); break;
        case '猫粮': this.data.CatFoodModule.push(element); break;
        case '预防': this.data.MedicalModule.push(element); break;
        case '配种': this.data.BreedingModule.push(element); break;
      }
    });
  },
  HandleModuleSelect(Event)
  {
    const {moduleid} = Event.target.dataset;
    if(this.data.CurrentSelectModuleIndex === moduleid) return;
    this.setData({CurrentSelectModuleIndex:moduleid});

    switch(moduleid)
    {
      case 0: this.setData({CurrentPublishs:this.data.Publishs}); break;
      case 1: this.setData({CurrentPublishs:this.data.CatModule}); break;
      case 2: this.setData({CurrentPublishs:this.data.CatFoodModule}); break;
      case 3: this.setData({CurrentPublishs:this.data.MedicalModule}); break;
      case 4: this.setData({CurrentPublishs:this.data.BreedingModule}); break;
    }
  },
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
  }
})