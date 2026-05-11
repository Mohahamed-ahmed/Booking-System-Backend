const express = require('express')
const router = express.Router()
const { isAuth } = require('../middleware/isAuth')
const { isAdmin } = require('../middleware/isAdmin')
const {body} = require('express-validator')
const BookingController = require('../controller/booking')

router.get('/bookings',isAuth, isAdmin, BookingController.getAllBookings)

router.get('/bookings/:id',isAuth, BookingController.getBookingById)

router.get('/my-bookings',isAuth, BookingController.getBookingsbyUserid)

router.post('/book-package', isAuth, [
    body('packageId').notEmpty().withMessage('Package ID is required'),
    body('numberOfPeople').isNumeric().withMessage('Number of people must be a number'),
    body('contact.name').isLength({ min: 3, max: 100 }).withMessage('Contact name must be between 3 and 100 characters'),
    body('contact.name').notEmpty().withMessage('Contact name is required'),
    body('contact.email').isEmail().withMessage('Valid email is required'),
    body('contact.email').notEmpty().withMessage('Contact email is required'),
    body('contact.phone').isLength({ min: 10, max: 15 }).withMessage('Contact phone must be between 10 and 15 characters'),
    body('contact.phone').notEmpty().withMessage('Contact phone is required')
], BookingController.createBooking)

router.put('/update-booking/:id',isAuth,isAdmin, BookingController.updateBookingStatus)

router.delete('/delete-booking/:id',isAuth,isAdmin, BookingController.deleteBooking)

module.exports = router;

