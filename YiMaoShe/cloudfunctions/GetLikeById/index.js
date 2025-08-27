// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  const {LikeId} = event;
  const db  = cloud.database();
  const Likes = db.collection('Likes');
  const {data} = await Likes.where({_id:LikeId}).get()
  return data;
}