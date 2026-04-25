const express = require("express");
const router = express.Router();
const authController = require('../controller/auth')
const { body } = require('express-validator');
const User = require('../models/user')

router.post("/register",[
  body('email').trim().isEmail().withMessage('Please enter a valid email address')
    .custom((value, {req})=>{
      return User.findOne({email:value}).then(user=>{
        if(user){
          return Promise.reject('E-mail already in use, Please choose a different one');
        }
      })
    }),
  body('confirmPassword').trim().custom((value, {req})=>{
    if(value !== req.body.password){
      throw new Error('Passwords does not match');
    }
    return true;
  }),
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('name').trim().isLength({ min: 3 }).withMessage('Name must be at least 3 characters long'),
  body('password').trim().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
] ,authController.signup) 


router.post('/login',[
  body('email').trim().isEmail().withMessage('Please enter a valid email address'),
  body('password').trim().notEmpty().withMessage('Password is required'),
],authController.login)

module.exports = router;
