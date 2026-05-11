const mongoose = require('mongoose')
const Destination = require('./destination')

const PackageSchema = new mongoose.Schema({
    name : {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    groupSize: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    included:{
        type: [String],
    },
    destinationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Destination',
        required: true
    }
})

module.exports = mongoose.model('Package', PackageSchema)