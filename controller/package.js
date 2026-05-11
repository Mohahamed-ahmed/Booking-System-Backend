const CloudinaryUploader = require('../utils/cloudinaryUpload')
const Package = require('../models/package');
const cloudinary = require('../config/cloudinary');
const { mongo, default: mongoose } = require('mongoose');

const extractPublicId = (url) => {
  const parts = url.split('/');
  const fileName = parts.pop(); // abc123.jpg
  const folder = parts.pop();   // destinations

  const publicId = fileName.split('.')[0]; // abc123

  return `${folder}/${publicId}`;
};

exports.AddPackage = (req,res,next)=>{
    const name = req.body.name;
    const description = req.body.description;
    const price = req.body.price;
    const duration = req.body.duration;
    const groupSize = req.body.groupSize;
    const included = req.body.included;
    const destinationId = req.body.destinationId;
    const imageBuffer = req.file.buffer

    if(!imageBuffer){
        const error = new Error('Image is required');
        error.statusCode = 422;
        throw error;
    }
    CloudinaryUploader(imageBuffer, 'packages')// Upload the image to Cloudinary and specify the folder
    .then(result=>{
        const package = new Package({
            name: name,
            description: description,
            price: price,
            duration: duration,
            groupSize: groupSize,
            included: included,
            destinationId: destinationId,
            image: result.secure_url // Store the secure URL of the uploaded image
        })
        return package.save();
    })
    .then(result=>{
        res.status(201).json({ message: 'Package added successfully', package: result });
    })
    .catch(err=>{
        next(err);
    })
}

exports.updatePackage = (req,res,next)=>{
    const packId = req.params.id;
    const name = req.body.name;
    const description = req.body.description;
    const price = req.body.price;
    const duration = req.body.duration;
    const groupSize = req.body.groupSize;
    const included = req.body.included;
    const destinationId = req.body.destinationId;
    const imageBuffer = req.file ? req.file.buffer : null;

    if(mongoose.Types.ObjectId.isValid(packId) === false){
        const error = new Error('Invalid package ID');
        error.statusCode = 400;
        throw error;
    }
    
    Package.findById(packId)
    .then(package=>{
        if(name){
            package.name = name;
        }
        if(description){
            package.description = description;
        }
        if(price){
            package.price = price;
        }
        if(duration){
            package.duration = duration;
        }
        if(groupSize){
            package.groupSize = groupSize;
        }
        if(included){
            package.included = included;
        }
        if(destinationId){
            package.destinationId = destinationId;
        }
        if(imageBuffer){
            // Handle image update logic here
            const oldPublicId = extractPublicId(package.image);
            return cloudinary.uploader.destroy(oldPublicId) //we use return here to ensure that the next then() waits for the image
            // deletion to complete before uploading the new image so we attached then for it in the same block and without return it will not wait for the deletion to complete before starting the upload which can lead to issues with Cloudinary's rate limits and also ensures that we don't have orphaned images in Cloudinary if the upload fails after deletion
            .then(()=>{
                return CloudinaryUploader(imageBuffer, 'packages') // Upload the new image to Cloudinary
            })
            .then(result=>{
                package.image = result.secure_url; // Update the image URL
                return package.save();
            })
        }
        return package.save();
    })
    .then(result=>{
        res.status(200).json({ message: 'Package updated successfully', package: result });
    })
    .catch(err=>{
        next(err)
    })
}

exports.getAllPackages = (req,res,next)=>{
    const limit = 10;
    const page = +req.query.page || 1; 
    const skip = (page - 1) * limit;
    Package.find()
    .skip(skip)
    .limit(limit)
    .then(packages=>{
        res.status(200).json({ packages: packages });
    })
    .catch(err=>{
        next(err);
    })
}

exports.getPackageById = (req,res,next)=>{
    const packId = req.params.id;

    Package.findById(packId)
    .then(package=>{
        res.status(200).json({ package: package });
    })
    .catch(err=>{
        next(err);
    })
}

exports.getPackagesByDestination = (req,res,next)=>{
    const destId = req.params.destinationId;
    const page = +req.query.page || 1; // Default to page 1 if not provided
    const limit = 10 
    const skip = (page - 1) * limit;
    Package.find({ destinationId: destId })
    .skip(skip)
    .limit(limit)
    .then(packages=>{
        res.status(200).json({ packages: packages });
    })
    .catch(err=>{
        next(err);
    })
}

exports.deletePackage = (req,res,next)=>{
    const packId = req.params.id;
    if(mongoose.Types.ObjectId.isValid(packId) === false){
        const error = new Error('Invalid package ID');
        error.statusCode = 400;
        throw error;
    }

    Package.findById(packId)
    .then(pack=>{
        if(!pack){
            const error = new Error('Package not found');
            error.statusCode = 404;
            throw error;
        }
        const publicId = extractPublicId(pack.image)
        return cloudinary.uploader.destroy(publicId) // Delete the image from Cloudinary
    })
    .then(()=>{
        return Package.findByIdAndDelete(packId)
    })
    .then(()=>{
        res.status(200).json({ message: 'Package deleted successfully' });
    })
    .catch(err=>{
        next(err);
    })
}