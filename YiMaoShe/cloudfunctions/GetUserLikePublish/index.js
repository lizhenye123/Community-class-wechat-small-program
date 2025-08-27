// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  const {OPENID} = cloud.getWXContext()
  const DB = cloud.database();
  const Users = DB.collection('Users');
  const User = await Users.where({_openid:OPENID});
  let TempUserLikes = (await User.get()).data[0].LikePublishs;
  if(TempUserLikes.length <= 0) return;

  const Publishs = DB.collection('Publishs');

  // 创建一个Promise数组  
  const promises = TempUserLikes.map(element => {  
    // 返回一个Promise对象，它将在文章查询完成后解析为文章内容  
    return Publishs.doc(element).get().then(res => res.data);  
  });  
  
  // 使用Promise.all等待所有Promise完成  
  let TempPublishs = await Promise.all(promises);  
  return TempPublishs;
}