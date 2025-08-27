// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  const DB = cloud.database();
  const {data} = await DB.collection('Publicitys').get();
  var ReturnValue=[];
  data.forEach(element => {
    ReturnValue.push({PublicityUrl:element.PublicityUrl,OpenUrl:element.OpenUrl});
  });
  return ReturnValue;
}