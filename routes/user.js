const express = require('express')
const router = express.Router()
const userController = require('../controller/user')
const { isAuth } = require('../middleware/isAuth')
const {isAdmin} = require('../middleware/isAdmin')

router.get('/profile', isAuth, userController.getUserProfile)
router.get('/user/:id', isAuth, isAdmin, userController.getuserById)

module.exports = router;