const mongoose = require('mongoose')
const Package = require('./package')
const User = require('./user')

const BookingSchema = new mongoose.Schema({
    packageId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Package',
        required: true
    },
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    numberOfPeople : {
        type: Number,
        required: true
    },
    totalPrice : {
        type: Number,
        required: true
    },
    contact:{
        type: {
            name: {
                type: String,
                required: true
            },
            email: {
                type: String,
                required: true
            },
            phone: {
                type: String,
                required: true
            }
        }
    },
    status: {
        type: String,
        default: 'pending'
    }
})

module.exports = mongoose.model('Booking', BookingSchema)