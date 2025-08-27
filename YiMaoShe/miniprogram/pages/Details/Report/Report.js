// pages/Details/Report/Report.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    Classs:['标题党','恶意信息','虚假宣传','与宠物无关','其他'],
    CurrentSelectClass:'无',
    Content:'',
    PublishId:''
  },

  //接收要举报的文章Id
  onLoad(options) 
  {
    let This=this;
    const Event = this.getOpenerEventChannel();
    Event.on('ReportPublish',function(PublishId)
    {
      This.setData({PublishId:PublishId});
    });
  },
  HandleSelectClass(Event)
  {
    const {value} = Event.detail;
    this.setData({CurrentSelectClass:this.data.Classs[value]});
  },
  HandleTextInput(Event)
  {
    this.setData({Content: Event.detail.value});
  },
  //上传举报信息
  async HandleReportClick(Event)
  {
    if(this.data.CurrentSelectClass === '无')
    {
      wx.showToast({icon:'none',title: '类型不能为空'});
      return;
    }
    if(this.data.Content === '')
    {
      wx.showToast({icon:'none',title: '内容不能为空'});
      return;
    }
    
    wx.showLoading({title: '正在上传到数据库'});

    await wx.cloud.callFunction({
      name:'AddReport',
      data:{Content:this.data.Content,
        CurrentSelectClass:this.data.CurrentSelectClass,
        PublishId:this.data.PublishId,
      },success(Event)
      {
        wx.navigateBack();
      }
    });
  }
})