const express = require('express')
const router = express.Router()
const destinationController = require('../controller/destination')
const upload = require('../middleware/multer')
const { isAuth } = require('../middleware/isAuth')
const { isAdmin } = require('../middleware/isAdmin')

router.get('/destinations', destinationController.getAllDestinations)

router.get('/destination/:id',destinationController.getDestinationDetails)

router.post('/add-destination', isAuth, isAdmin, upload.single('image'), destinationController.addDestination)

router.put('/update-destination/:id', isAuth, isAdmin, upload.single('image'), destinationController.updateDestination)

router.delete('/delete-destination/:id', isAuth, isAdmin,destinationController.deleteDestination)

module.exports = router;