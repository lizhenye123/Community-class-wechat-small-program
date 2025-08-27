// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {

  const {OPENID}= cloud.getWXContext();
  const DB = cloud.database();
  const Users = await DB.collection('Users');

  try
  {
    await Users.add({
      data:{
        _openid: OPENID,
        RegisterTime: new Date(),
        AvatarUrl:event.AvatarUrl,
        UserName:event.UserName
      }
    })
  }catch(Error)
  {
    console.error(Error)
  }
}