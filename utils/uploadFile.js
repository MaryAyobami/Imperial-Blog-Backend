const AWS = require("aws-sdk/clients/s3");
const fs = require("fs")
const path = require('path')


const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;

const s3 = new AWS({
  region,
  accessKeyId,
  secretAccessKey
})

// uploads a file to s3
function uploadFile(file) {
    // const fileStream = fs.readFileSync( path.join(process.cwd(), `imperial_logo.png`))
   const fileStream = fs.createReadStream(file.path)
  
    const uploadParams = {
      Bucket: bucketName,
      Body: fileStream,
      Key : file.filename,
      ContentDisposition : 'inline',
      ContentType : 'application/pdf'

    }
    return s3.upload(uploadParams).promise()
  }
exports.uploadFile = uploadFile
  
// exports.uploadInline = (file) =>{
//   const fileStream = fs.createReadStream(file.path)
  
//   const uploadParams = {
//     Bucket: bucketName,
//     Body: fileStream,
//     Key : file.filename,
//     contentDisposition : 'inline'
//   }

//   return s3.upload(uploadParams).promise()

// }