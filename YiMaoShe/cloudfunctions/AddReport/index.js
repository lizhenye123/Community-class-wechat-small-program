// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  const {OPENID} = cloud.getWXContext()
  const {Content,CurrentSelectClass,PublishId} = event;
  const db  =  cloud.database();
  const Reports = await db.collection('Reports');

  try
  {
    await Reports.add({
      data:{
      _openid:OPENID,
      Time:new Date(),
      Content:Content,
      ReportClass:CurrentSelectClass,
      PublishId:PublishId,
      }
    });
  }catch(Error)
  {
    console.error(Error);
  }
}