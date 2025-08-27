// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  const {OPENID} = cloud.getWXContext();
  const db = cloud.database();
  const Users = db.collection('Users');
  let Result = Users.where({_openid:OPENID});
  let {data} = await Result.get();
  return data;
  
}