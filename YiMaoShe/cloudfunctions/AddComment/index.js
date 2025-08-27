// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  const {OPENID} = cloud.getWXContext();
  const {_id,Content,ImageList} = event;
  //找到评论
  const DB = cloud.database();
  const Comment= await DB.collection('Comments').where({_id:_id});
  const CommentData = (await Comment.get()).data[0];

  //找到评论的这个人的头像和名字
  const Users = DB.collection('Users');
  let User = Users.where({_openid:OPENID});
  let UserData = (await User.get()).data[0];

  //填这个评论的信息
  let TempComment={};
  TempComment.UserAvatar = UserData.AvatarUrl;
  TempComment.UserName= UserData.UserName;
  TempComment._openid = OPENID,
  TempComment.Content = Content;
  TempComment.ImageList = ImageList;
  TempComment.Time = new Date();
  //更新评论数组
  let TempCommentUsers = CommentData.CommentUsers;
  TempCommentUsers.push(TempComment);

  await DB.collection('Comments').where({_id:_id}).update({
    data:{CommentUsers:TempCommentUsers},
    success(event)
    {
    },fail(Error)
    {
      console.error(Error);
    }
  });
}