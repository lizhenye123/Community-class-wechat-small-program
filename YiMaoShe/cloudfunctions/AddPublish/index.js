// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  const {OPENID} = cloud.getWXContext()
  const {PublishStruct} = event;
  const db  = cloud.database();
  const Publishs = db.collection('Publishs');
  const Likes = db.collection('Likes');
  const Comments = db.collection('Comments');
  
  const Like = await Likes.add({
    data:{
      LikeUsers:[],
    }
  });

  const Comment = await Comments.add({
    data:{
      CommentUsers:[],
    }
  });

  const Publish =  await Publishs.add({
    data:{
      _openid:OPENID,
      PublishTime:new Date(),
      LikeId:Like._id,
      CommentId:Comment._id,
      ...PublishStruct
  }});
}