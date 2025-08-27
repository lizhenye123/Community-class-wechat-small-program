const {DBTimeToString} = require('../../FunctionLibrary/FileLibrary');

Component({

  /**
   * 组件的属性列表
   */
  properties: {
    Comment:{type:Object,value:undefined,observer(Event)
    {

    }}
  },

  /**
   * 组件的初始数据
   */
  data: {
    Time:'',
  },

  /**
   * 组件的方法列表
   */
  methods: 
  {
    HandlePreviewImage(Event)
    {
      let Index = Event.currentTarget.dataset.imageindex;
      let TempList = this.data.Comment.ImageList;
      wx.previewImage({
        urls: TempList,
        current:TempList[Index],
      });
    },
  },
  lifetimes:
  {
    async ready()
    {
      if(this.data.Time === '')
      {
        if(this.properties.Comment !== undefined)
        {
          let TempTime = DBTimeToString(this.properties.Comment.Time);
          this.setData({Time:TempTime});
        }
      }
    }
  },
  pageLifetimes: 
  {
    show: function() {
      
    },
  },
  //时间有时候为空，报红，因为Comment还没过来ready就走了，感觉是小程序自己的问题，在递归设置Time值，避免不显示时间
  async RecursionUpdateTime(Time)
  {
    if(this.data.Time === '')
    {
      if(this.properties.Comment !== undefined)
      {
        let TempTime = DBTimeToString(this.properties.Comment.Time);
        this.setData({Time:TempTime});
      }else
      {
        this.RecursionUpdateTime(Time);
      }
    }
  }
})