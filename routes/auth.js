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
      throw new Error('Passwords do not match');
    }
    return true;
  }),
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('password').trim().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
] ,authController.signup) 

module.exports = router;
