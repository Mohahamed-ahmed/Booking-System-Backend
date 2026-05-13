const Destination = require('../models/destination')
const Package = require('../models/package')
const cloudinaryUploader = require('../utils/cloudinaryUpload')
const cloudinary = require('../config/cloudinary'); 
const { mongo, default: mongoose } = require('mongoose');


const extractPublicId = (url) => {
  const parts = url.split('/');
  const fileName = parts.pop(); // abc123.jpg
  const folder = parts.pop();   // destinations

  const publicId = fileName.split('.')[0]; // abc123

  return `${folder}/${publicId}`;
};

exports.addDestination = (req,res,next)=>{
    const name = req.body.name;
    const description = req.body.description;
    const imageBuffer = req.file.buffer;

    if(!imageBuffer){
        const error = new Error('Image is required');
        error.statusCode = 422;
        throw error;
    }
    cloudinaryUploader(imageBuffer, 'destinations') // Upload the image to Cloudinary and specify the folder
    .then(result=>{
        const destination = new Destination({
            name: name,
            description: description,
            image: result.secure_url // Store the secure URL of the uploaded image
        })
        return destination.save();
    })
    .then(result=>{
        res.status(201).json({ message: 'Destination added successfully', destination: result });
    })
    .catch(err=>{
        next(err);
    })
}

exports.updateDestination = (req,res,next)=>{
    const destId = req.params.id;
    const name = req.body.name;
    const description = req.body.description;

    if(mongoose.Types.ObjectId.isValid(destId) === false){
        const error = new Error('Invalid destination ID');
        error.statusCode = 400;
        throw error;
    }

    Destination.findById(destId)
    .then(destination=>{
        if(!destination){
            const error = new Error('Destination not found');
            error.statusCode = 404;
            throw error;
        }
        if(name){
            destination.name = name;
        }
        if(description){
            destination.description = description;
        }
        if(req.file){
            const imageBuffer = req.file.buffer;
            const oldPublicId = extractPublicId(destination.image);
            return cloudinary.uploader.destroy(oldPublicId) // Delete the old image from Cloudinary
            .then(()=>{
                return cloudinaryUploader(imageBuffer,'destinations') // Upload the new image to Cloudinary
            })
            .then(result=>{
                destination.image = result.secure_url; // Update the image URL
                return destination.save(); 
            })
        }
        //if no new image is uploaded, just save the updated destination
        return destination.save();
    })
    .then(result=>{
        res.status(200).json({ message: 'Destination updated successfully', destination: result });
    })
    .catch(err=>{
        next(err);
    })
}

exports.deleteDestination = (req,res,next)=>{
    const destId = req.params.id;

    if(mongoose.Types.ObjectId.isValid(destId) === false){
        const error = new Error('Invalid destination ID');
        error.statusCode = 400;
        throw error;
    }

    let loadedDestination;

    Destination.findById(destId)
    .then(destination=>{
        if(!destination){
            const error = new Error('Destination not found');
            error.statusCode = 404;
            throw error;
        }

        loadedDestination = destination;

        return Package.find({ destinationId: destId });
    })
    .then(packages=>{

        const deleteImagesPromises = packages.map(pkg => {

            const publicId = extractPublicId(pkg.image);

            return cloudinary.uploader.destroy(publicId);
        });

        return Promise.all(deleteImagesPromises);
    })
    .then(()=>{

        return Package.deleteMany({ destinationId: destId });

    })
    .then(()=>{

        const publicId = extractPublicId(loadedDestination.image);

        return cloudinary.uploader.destroy(publicId);

    })
    .then(()=>{

        return Destination.findByIdAndDelete(destId);

    })
    .then(()=>{

        res.status(200).json({
            message: 'Destination deleted successfully'
        });

    })
    .catch(err=>{
        next(err);
    })
}

exports.getAllDestinations = (req,res,next)=>{
    const page = +req.query.page || 1; // Default to page 1 if not provided
    const limit = 10 
    const skip = (page - 1) * limit;
    Destination.find()
    .skip(skip)
    .limit(limit)//pagination can be implemented here by using skip and limit
    .then(destinations=>{
        if(destinations.length === 0){
            return res.status(200).json({ message: 'No destinations found', destinations: [] });
        }
        res.status(200).json({ destinations: destinations });
    })
    .catch(err=>{
        next(err);
    })
}

exports.getDestinationDetails = (req,res,next)=>{
    const destId = req.params.id;
    if(mongoose.Types.ObjectId.isValid(destId) === false){
        const error = new Error('Invalid destination ID');
        error.statusCode = 400;
        throw error;
    }
    Destination.findById(destId)
    .then(destination=>{
        if(!destination){
            const error = new Error('Destination not found');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({ destination: destination });
    })
    .catch(err=>{
        next(err);
    })
}