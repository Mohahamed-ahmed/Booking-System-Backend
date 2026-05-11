const cloudinary = require('../config/cloudinary')

const cloudinaryUpload = (fileBuffer,folderName)=>{
    return new Promise((resolve, reject)=>{
        const stream = cloudinary.uploader.upload_stream(
            { folder: folderName },
            (error,result)=>{
                if(error){
                    reject(error);
                }else{
                    resolve(result);
                }
            }
        )
        stream.end(fileBuffer);
    })
}

module.exports = cloudinaryUpload;