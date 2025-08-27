const {UploadImage} = require('../../FunctionLibrary/FileLibrary');
const App = getApp();
Page({

  data: {
    Content:'',
    ImageList:[],
    Video:undefined,
    Location:{},

    Publishs:App.globalData.Publishs,
    CatModule:App.globalData.CatModule,
    CatFoodModule:App.globalData.CatFoodModule,
    BreedingModule:App.globalData.BreedingModule,
    MedicalModule:App.globalData.CatModule,
    CurrentSelectModuleIndex:0,
    CurrentSelectModule:[],
    CurrentSelectClass:'请选择类型',
    SelectStyle:{Color:'#1890FF',TabColor: '#333' || '#20ACAB'}
  },
  onLoad(options) 
  {
    this.setData({CurrentSelectModule:this.data.CatModule});
    this.setData({CurrentSelectClass:this.data.CurrentSelectModule[0]});
  },
  //文本内容的输入
  HandleTextInput(Event)
  {
    this.setData({Content: Event.detail.value});
  },
  //删除选中的图片
  HandleDeleteImage(Event)
  {
    let Index = Event.currentTarget.dataset.imageid;
    let TempList =this.data.ImageList;
    TempList.splice(Index,1);
    this.setData({ImageList:TempList});
  },
  //预览图片
  HandleThisImage(Event)
  {
    let Index = Event.currentTarget.dataset.imageid;
    let TempList = this.data.ImageList;
    wx.previewImage({
      urls: TempList,
      current:TempList[Index]
    })
  },
  //填要上传的图片
  HandleChooseImage(Event)
  {
    let count = 9 - this.data.ImageList.length;
    wx.chooseMedia({
      count:count,
      mediaType:['image'],
      sourceType:['album','camera'],
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
    var TempList = this.data.ImageList;
    TempList = TempList.concat(ImagePath);
    this.setData({ImageList:TempList});
  },
  //上传视频
  HandleChooseVideo(Event)
  {
    let count = this.data.ImageList.length >= 9 ? 0 : 1;
    wx.chooseMedia({
      count:count,
      mediaType:['video'],
      maxDuration:60,
      sourceType:['album','camera'],
      success:(Result)=>
      {
        this.ClearCacheVideoOrImage('Video');
        this.setData({Video:Result.tempFiles[0]});
        
      },
      fail:(Error)=>
      {
        console.error(Error);
      }
    });
  },
  //删除这个视频
  HandleDeleteVideo(Event)
  {
    this.setData({Video:{}});
  },
  //清理图片和视频文件的缓存
  ClearCacheVideoOrImage(Type)
  {
    if(Type === 'Video')
    {
      this.setData({Video:{}});
    }else if(Type === 'ImageList')
    {
      this.setData({ImageList:[]});
    }
  },
  //上传位置
  HandleChooseLocation(Event)
  {
    wx.showLoading({title: '正在加载'});

    wx.chooseLocation({
      success:(Result)=>
      {
        wx.hideLoading();
        
        let TampLocation={};
        TampLocation.LocationName=Result.address + Result.name;
        TampLocation.Latitude=Result.latitude;
        TampLocation.Longitude = Result.longitude;
        this.setData({Location:TampLocation});
      },fail:(Error)=>
      {
        wx.hideLoading();
        wx.showToast({
          icon:'none',
          title: '位置获取失败，请检查获取位置权限，或者联系管理员',
        });
        console.error(Error);
      }
    });
  },
  //删除这个位置
  HandleDeleteLocation(Event)
  {
    let TampLocation={};
    TampLocation.LocationName = '选择位置';
    this.setData({Location:TampLocation});
  },
  //模块选择
  HandleModuleSelect(Event)
  {
    const {moduleid} = Event.target.dataset;
    this.setData({CurrentSelectModuleIndex:moduleid});
    let TempModule=[];
    switch(moduleid)
    {
      case 0:TempModule = this.data.CatModule;break;
      case 1:TempModule = this.data.CatFoodModule;break;
      case 2:TempModule = this.data.BreedingModule;break;
      case 3:TempModule = this.data.MedicalModule;break;
    }
    this.setData({CurrentSelectModule:TempModule});
    this.setData({CurrentSelectClass:this.data.CurrentSelectModule[0]});
  },
  //子类型选择
  HandleSelectClass(Event)
  {
    const {value} = Event.detail;
    this.setData({CurrentSelectClass:this.data.CurrentSelectModule[value]});
  },
  //发布消息上传数据库
 async HandlePublishClick(Event)
 {
    if(this.data.Content.length<=0)
    {
      wx.showToast({ icon:'none', title: '发布内容不能为空'});
      return;
    }
    wx.showLoading({title:'正在上传，请稍等',mask:true});
    //获取所有要上传的信息
    let PublishStruct={};
    PublishStruct.Content = this.data.Content;
    PublishStruct.Location = this.data.Location;
    PublishStruct.PublishModule = this.data.Publishs[this.data.CurrentSelectModuleIndex];
    PublishStruct.ModuleSelectClass = this.data.CurrentSelectClass;
    PublishStruct.ImageList=[];

    //获取上传到云储存的文件Id
    if(this.data.ImageList.length > 0)
    {
      const ImageList = this.data.ImageList;  
      const UploadPromises = ImageList.map((element, index) => 
      {  
        const CloudPath = 'UserFile/Image';  
        // 返回每个文件的上传 Promise 
        return UploadImage(CloudPath, element);  
      }); 
      await Promise.all(UploadPromises)  
      .then(FileIDs => {  
      PublishStruct.ImageList = FileIDs;
      })  
      .catch(Error => {  
      console.error('Error uploading files:', Error);  
      });
    }
    
    //获取上传到云储存的文件id
    let VideoId='';
    if(this.data.Video !== undefined)
    {
      let tempFilePath = this.data.Video.tempFilePath;
      await UploadImage('UserFile/Video', tempFilePath)
        .then(fileID => {
          VideoId=fileID;
        })
        .catch(error=>{
          console.error('Error uploading files:', error);  
        });
    }
    PublishStruct.Video=VideoId;
    //上传当前文章到Publishs数据库
    await wx.cloud.callFunction({name:'AddPublish',data:{PublishStruct}});

   wx.hideLoading();
   wx.showToast({title: '发布成功'});
   this.CleanCurrentPublishMessage();
  },
  //清理当前发布板块信息
  CleanCurrentPublishMessage()
  {
    this.setData({
      Content:'',
      Location:{},
      Video:{},
      ImageList:[],
      CurrentSelectModule:this.data.CatModule,
      CurrentSelectModuleIndex:0,
      CurrentSelectClass:this.data.CatModule[0],
    });
  }
})