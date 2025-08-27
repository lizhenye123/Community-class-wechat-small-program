// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  const {OPENID}= cloud.getWXContext()
  const {LikeId,LikeUsers,AddOrRemove,PublishId} = event;
  const DB = cloud.database();
  const Likes = DB.collection('Likes');
  const Like = await Likes.where({_id:LikeId}).update({
    data:{LikeUsers:LikeUsers},
    success(event)
    {
    },fail(Error)
    {
      console.error(Error);
    }
  });

  if(AddOrRemove===0)return;
  const Users = DB.collection('Users');
  const User = await Users.where({_openid:OPENID});
  let TempUserLikes = (await User.get()).data[0].LikePublishs;

  if(AddOrRemove > 0)
  {
    if(TempUserLikes.includes(PublishId)) return;
    TempUserLikes.push(PublishId); 
    await Users.where({_openid:OPENID}).update({
      data:{LikePublishs:TempUserLikes},
      success(event)
      {
      },fail(Error)
      {
        console.error(Error);
      }
    });
  }
  else
  {
    let RemoveIndex = TempUserLikes.indexOf(PublishId)
    if(RemoveIndex!==-1)
    {
      TempUserLikes.splice(RemoveIndex,1);
      await Users.where({_openid:OPENID}).update({
        data:{LikePublishs:TempUserLikes},
        success(event)
        {
        },fail(Error)
        {
          console.error(Error);
        }
      });
    };
  }
  
  
}