const {UploadImage} = require('../../../FunctionLibrary/FileLibrary');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    Comments:{},
    KeyboardInputValue:'',
    //是否显示图片选择面板
    bSendMoreMsgFlag:false,
    //选中的本地路径图片
    ImageList:[],
    //要删除的图片Index
    DeleteIndex:-1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  //接收评论信息
  onLoad(options) 
  {
    let This = this;
    const Event = this.getOpenerEventChannel();
    Event.on('SetComments',function(Comments)
    {
      This.setData({Comments:Comments});
    });
  },
  HandleCommentInput(Event)
  {
    const {value} = Event.detail;
    this.setData({KeyboardInputValue:value});
  },
  HandleSendMoreMsg(Event)
  {
    let bIsShow = !this.data.bSendMoreMsgFlag;
    this.setData({bSendMoreMsgFlag:bIsShow});
  },
  HandleChooseImage(Event)
  {
    let count = 3 - this.data.ImageList.length;
    const {category} = Event.currentTarget.dataset;
    wx.chooseMedia({
      count:count,
      mediaType:['image'],
      sourceType:[category],
      success:(Result)=>
      {
        Result.tempFiles.forEach(element => {
          this.AddNewImage(element.tempFilePath);
        });
      },
      fail:(Error)=>
      {
        console.error(Error);
      }
    });
  },
  AddNewImage(ImagePath)
  {
    let TempList = this.data.ImageList;
    TempList = TempList.concat(ImagePath);
    this.setData({ImageList:TempList});
  },
  HandleDeleteImage(Event)
  {
    let Index=Event.currentTarget.dataset.index;
    
    let TempList =this.data.ImageList;
    TempList.splice(Index,1);
    this.setData({ImageList:TempList,DeleteIndex:Index});
  },
  //发布评论
  async HandleSubmitComment(Event)
  {
    if(this.data.KeyboardInputValue.length<=0)
    {
      wx.showToast({ icon:'none', title: '发布内容不能为空'});
      return;
    }

    wx.showLoading({title:'正在上传，请稍等',mask:true});
    let CloudImageList=[];

    if(this.data.ImageList.length > 0)
    {
      const ImageList = this.data.ImageList;  
      const UploadPromises = ImageList.map((element, index) => 
      {  
        const CloudPath = 'Comments/' + this.data.Comments._id;  
        return UploadImage(CloudPath, element); // 返回每个文件的上传 Promise  
      }); 
      await Promise.all(UploadPromises)  
      .then(fileIDs => {  
      CloudImageList = fileIDs;
      })  
      .catch(error => {  
      console.error('Error uploading files:', error);  
      });
    }

    let Content = this.data.KeyboardInputValue;
    let CommentId = this.data.Comments._id;
    let This = this;
    //上传发布的评论
    wx.cloud.callFunction({
      name:'AddComment',
      data:{_id:CommentId,Content:Content,ImageList:CloudImageList},
      success(Event)
      {
        This.UpdateCurrentCommentPage();
      },fail(Error)
      {
        console.error(Error.errMsg);
      }
    });

   wx.hideLoading();
   wx.showToast({title: '发布成功'});
   this.ResetCommentMessage();
  },
  //发布后清空信息槽
  ResetCommentMessage()
  {
    this.setData({
      KeyboardInputValue:'',
      bSendMoreMsgFlag:false,
      ImageList:[],
      DeleteIndex:-1,
    });
  },
  //评论上传到服务器以后更新成功的回调
  async UpdateCurrentCommentPage()
  {
    let CommentResult = await wx.cloud.callFunction({
      name:'GetCommentById',
      data:{CommentId:this.data.Comments._id}
    });
    let TempComment = CommentResult.result[0];
    this.setData({Comments:TempComment});
  }
})