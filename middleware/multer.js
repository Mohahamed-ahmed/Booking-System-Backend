const multer = require('multer')

const storage = multer.memoryStorage()

const fileFilter = (req,file,cb)=>{
    if(
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'
    ){
        cb(null,true)
    }else{
        cb(new Error('Invalid file type. Only PNG, JPG and JPEG are allowed.'),false)
    }
}

const upload = multer({storage:storage, fileFilter:fileFilter})

module.exports = upload;