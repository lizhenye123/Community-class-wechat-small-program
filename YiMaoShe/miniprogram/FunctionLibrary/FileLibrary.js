function UploadImage(CloudFolderPath,FilePath)
{
  if(typeof FilePath!== 'string')return;
	return new Promise((resolve,reject)=>{
		let ImageName = FilePath.substring(FilePath.lastIndexOf('/'));
		wx.cloud.uploadFile({
			cloudPath:CloudFolderPath+ImageName,
			filePath:FilePath,
			success(Result){
				resolve(Result.fileID);
			},
			fail(Error){
				reject(Error);
			}
		});
	});
}
function IsLike(LikeArray,OpenId)
{
  if(LikeArray.includes(OpenId))
  {
    return '../../images/Common/Like.png'
  }
  return '../../images/Common/Unlike.png'
}
function SwitchLikeIcon(LikePath)
{
  if(LikePath === '../../images/Common/Unlike.png')
  {
    return {bLike:true,LikeUrl:'../../images/Common/Like.png'};
  }else
  {
    return {bLike:false,LikeUrl:'../../images/Common/Unlike.png'};
  }
}
function DBTimeToString(Time)
{
    const PublishDate = new Date(Time);  
    // 获取年、月、日、时、分  
    const year = PublishDate.getFullYear();  
    // 月份是从0开始的，所以需要+1，并用padStart补零
    const month = String(PublishDate.getMonth() + 1).padStart(2, '0');   
    const day = String(PublishDate.getDate()).padStart(2, '0');  
    const hours = String(PublishDate.getHours()).padStart(2, '0');  
    const minutes = String(PublishDate.getMinutes()).padStart(2, '0');  
    // 拼接格式 
    const FormattedDate = `${year}-${month}-${day} ${hours}:${minutes}`;  
    return FormattedDate;
}

module.exports={
  UploadImage,
  IsLike,
  DBTimeToString,
  SwitchLikeIcon,
}