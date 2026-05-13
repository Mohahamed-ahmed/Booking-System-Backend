const express = require('express')
const router = express.Router()
const userController = require('../controller/user')

router.get('/profile', userController.getUserProfile)
router.get('/user/:id', userController.getuserById)

module.exports = router;