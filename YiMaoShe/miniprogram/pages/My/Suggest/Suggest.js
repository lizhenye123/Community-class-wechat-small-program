// pages/My/Suggest/Suggest.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    Content:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },
  HandleTextInput(Event)
  {
    this.setData({Content: Event.detail.value});
  },
  //上传反馈
  async HandlePublishClick(Event)
  {
    if(this.data.Content.length<=0)
    {
      wx.showToast({ icon:'none', title: '反馈内容不能为空'});
      return;
    }
    await wx.cloud.callFunction({name:'AddSuggest',data:{Content:this.data.Content}});
    wx.showLoading({title:'正在上传，请稍等',mask:true});
    wx.hideLoading();
    wx.showToast({title: '反馈成功'});
    this.setData({Content:''});
    wx.navigateBack();
  },

})