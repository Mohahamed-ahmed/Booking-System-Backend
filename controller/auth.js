const User = require("../models/user");
const bcrypt = require("bcrypt");
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken')

exports.signup = (req, res, next) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    const error = new Error('Validation failed, entered data is incorrect');
    error.statusCode = 422; 
    error.data = errors.array();
    throw error;
  }
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  // const confirmPassword = req.body.confirmPassword;

  bcrypt
    .hash(password, 12)
    .then((hashedPassword) => {
      const user = new User({
        name: name,
        email: email,
        password: hashedPassword,
      });
      return user.save();
    }).then(result => {
      res.status(201).json({ message: "User registered successfully!", userId: result._id });

    })
    .catch((err) => {
      next(err); // Pass the error to the error handling middleware
    });
};

exports.login = (req,res,next)=>{
  const email = req.body.email;
  const password = req.body.password;
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    const error = new Error('Validation failed, entered data is incorrect');
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  User.findOne({email:email})
  .then(user=>{
    if(!user){
      const error = new Error('incorrect email or password');
      error.statusCode = 401;
      throw error;
    }
    return bcrypt.compare(password,user.password)
    .then(isMatch=>{
      if(!isMatch){
        const error = new Error('Incorrect email or password');
        error.statusCode = 401;
        throw error;
      }
      const token = jwt.sign({
        userId: user._id.toString(),
        email:user.email,
        role:user.role
      },
      process.env.JWT_SECRET_KEY,
      {expiresIn:'1h'}
      )
      res.status(200).json({token:token, userId:user._id.toString(), role:user.role})
    })
  })
  .catch(err=>{
    next(err);
  })
}
