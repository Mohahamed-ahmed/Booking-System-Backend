const {validationResult} = require('express-validator')
const Booking = require('../models/booking')
const Package = require('../models/package');
const { default: mongoose } = require('mongoose');

exports.createBooking = (req,res,next)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        const error = new Error('Validation failed, entered data is incorrect');
        error.statusCode = 422; 
        error.data = errors.array();
        throw error;
    }
    const userId = req.userId;
    const packageId = req.body.packageId;
    const numberOfPeople = req.body.numberOfPeople;
    const contact = req.body.contact
    const totalPrice = req.body.totalPrice;
    const status = req.body.status;

    const booking = new Booking({
        packageId: packageId,
        userId: userId,
        numberOfPeople: numberOfPeople,
        totalPrice: totalPrice,
        contact: contact,
        status: status
    })
    booking.save()
    .then(result=>{
        res.status(201).json({ message: 'Booking created successfully', booking: result });
    })
    .catch(err=>{
        next(err)
    })
}

exports.getAllBookings = (req,res,next)=>{
    const limit = 10
    const page = +req.query.page || 1;
    const skip = (page - 1) * limit;

    Booking.find()
    .skip(skip).limit(limit)
    .then(bookings=>{
        if(bookings.length === 0){
            return res.status(200).json({ message: 'No bookings found', bookings: [] });
        }
        res.status(200).json({ message: 'Bookings fetched successfully', bookings: bookings });
    })
    .catch(err=>{
        next(err)
    })
}
exports.getBookingById = (req,res,next)=>{
    const bookingId = req.params.id;

    if(mongoose.Types.ObjectId.isValid(bookingId) === false){
        const error = new Error('Invalid booking ID');
        error.statusCode = 400;
        throw error;
    }

    Booking.findById(bookingId)
    .then(booking=>{
        if(!booking){
            const error = new Error('Booking not found');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({ message: 'Booking fetched successfully', booking: booking });
    })
    .catch(err=>{
        next(err)
    })
}

exports.getBookingsbyUserid = (req,res,next)=>{
    const userId = req.userId;
    const limit = 10
    const page = +req.query.page || 1;
    const skip = (page - 1) * limit;

    if(mongoose.Types.ObjectId.isValid(userId) === false){
        const error = new Error('Invalid user ID');
        error.statusCode = 400;
        throw error;
    }

    Booking.find({ userId: userId })
    .skip(skip)
    .limit(limit)
    .then(bookings => {
        if (bookings.length === 0) {
            return res.status(200).json({ message: 'No bookings found', bookings: [] });
        }
        res.status(200).json({ message: 'Bookings fetched successfully', bookings: bookings });
    })
    .catch(err => {
        next(err);
    });
}

exports.updateBookingStatus = (req,res,next)=>{
    const bookingId = req.params.id;
    const newStatus = req.body.status;

    if(mongoose.Types.ObjectId.isValid(bookingId) === false){
        const error = new Error('Invalid booking ID');
        error.statusCode = 400;
        throw error;
    }

    Booking.findById(bookingId).then(booking=>{
        if(!booking){
            const error = new Error('Booking not found');
            error.statusCode = 404;
            throw error;
        }
        booking.status = newStatus;
        return booking.save();
    }).then(result=>{
        res.status(200).json({ message: 'Booking status updated successfully', booking: result });
    }).catch(err=>{
        next(err)
    })
}

exports.deleteBooking = (req,res,next)=>{
    const bookingId = req.params.id;
    if(mongoose.Types.ObjectId.isValid(bookingId) === false){
        const error = new Error('Invalid booking ID');
        error.statusCode = 400;
        throw error;
    }
    Booking.findByIdAndDelete(bookingId)
    .then(result=>{
        res.status(200).json({ message: 'Booking deleted successfully', booking: result });
    })
    .catch(err=>{
        next(err)
    })
}