// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const {PublishsCount} = event;
  const db = cloud.database();
  const Publishs = db.collection('Publishs');
  try
  {
    const Result = await Publishs.orderBy('PublishTime','desc').limit(PublishsCount).get();
    return Result.data;
  }
  catch(Error)
  {
    console.error(Error);
  }
}