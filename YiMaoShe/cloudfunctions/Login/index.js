// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  const {OPENID} = cloud.getWXContext()
	const DB = cloud.database();
	const _ = DB.command;
  let Users = await DB.collection('Users');
  let Result =  Users.where({_openid:_.eq(OPENID)}).get();
  
  return Boolean((await Result).data.length);
}