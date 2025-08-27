// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  const {CommentId} = event;
  const db  = cloud.database();
  const Comments = db.collection('Comments');
  const {data} = await Comments.where({_id:CommentId}).get()
  return data;
}