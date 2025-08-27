// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  const {OPENID} = cloud.getWXContext()
  const {Content} = event;
  const db  = cloud.database();
  const Suggests = db.collection('Suggests');
  await Suggests.add({
    data:{
      _openid:OPENID,
      PublishTime:new Date(),
      Content:Content,
    }});
}