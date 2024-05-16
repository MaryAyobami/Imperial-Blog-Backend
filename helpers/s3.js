const S3 = require('aws-sdk/clients/s3')
const dotenv = require("dotenv")
const fs = require('fs')
dotenv.config()


const bucketName = process.env.AWS_BUCKET_NAME
const region = process.env.AWS_BUCKET_REGION
const accessKeyId = process.env.AWS_ACCESS_KEY
const secretAccessKey = process.env.AWS_SECRET_KEY


const s3 = new S3 ({
    region,
    accessKeyId,
    secretAccessKey
})

function uploadFile(file) {
    const fileStream = fs.createReadStream(file.path)
  
    const uploadParams = {
      Bucket: bucketName,
      Body: fileStream,
      Key: file.filename
    }
  
    return s3.upload(uploadParams).promise()
  }
  exports.uploadFile = uploadFile
  
  var dels3 = new S3({
    region,
    accessKeyId,
    secretAccessKey
  });

  dels3.deleteObject({
    Bucket: bucketName,
    Key: 'some/subfolders/nameofthefile1.extension'
  },function (err,data){})