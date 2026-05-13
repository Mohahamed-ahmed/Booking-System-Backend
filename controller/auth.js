const User = require("../models/user");
const bcrypt = require("bcrypt");
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken')
const { Resend } = require('resend');
const dotenv = require('dotenv').config();

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

  let Loadeduser; // Declare user variable to be used in the outer scope

  User.findOne({email:email})
  .then(user=>{
    if(!user){
      const error = new Error('incorrect email or password');
      error.statusCode = 401;
      throw error;
    }
    Loadeduser = user; // Assign the found user to the outer variable
    return bcrypt.compare(password,user.password)
  })
  .then(isMatch=>{
      if(!isMatch){
        const error = new Error('Incorrect email or password');
        error.statusCode = 401;
        throw error;
      }
      // Generate a JWT token for the authenticated user
      const token = jwt.sign({
        userId: Loadeduser._id.toString(),
        email:Loadeduser.email,
        role:Loadeduser.role
      },
      process.env.JWT_SECRET_KEY,
      {expiresIn:'1h'}
      )
      // Generate a refresh token and save it to the user's record in the database
      const refreshToken = jwt.sign({
        userId: Loadeduser._id.toString(),
      },
      process.env.REFRESH_TOKEN_SECRET_KEY,
      {expiresIn:'7d'}
    )
    Loadeduser.refreshToken = refreshToken;
    return Loadeduser.save()
    .then(()=>{
      res.cookie('refreshToken', Loadeduser.refreshToken, {
        httpOnly: true,
        secure: true, // Set to true in production with HTTPS
        sameSite: 'none',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });
      res.status(200).json({accessToken:token, userId:Loadeduser._id.toString(), role:Loadeduser.role})
    })
  })
  .catch(err=>{
    next(err);
  })
}

exports.refreshToken = (req,res,next)=>{
  const refreshToken = req.cookies.refreshToken;

  if(!refreshToken){
    const error = new Error('No refresh token provided');
    error.statusCode = 401;
    throw error;
  }
  let decodedToken;
  try{
    decodedToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET_KEY);
  }catch(err){
    const error = new Error('Invalid refresh token');
    error.statusCode = 401;
    throw error;
  }
  const userId = decodedToken.userId;
  User.findById(userId)
  .then(user=>{
    if(!user || user.refreshToken !== refreshToken){
      const error = new Error('Invalid refresh token');
      error.statusCode = 401;
      throw error;
    }
    const newAccessToken = jwt.sign({
      userId: user._id.toString(),
      email:user.email,
      role:user.role
    },
    process.env.JWT_SECRET_KEY,
    {expiresIn:'1h'}
    )
    res.status(200).json({accessToken:newAccessToken, userId:user._id.toString(), role:user.role})
  })
  .catch(err=>{
    next(err);
  })
}

exports.forgetPassword = (req,res,next)=>{
  const email = req.body.email;
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
      const error = new Error('error')// For security reasons, we don't reveal whether the email exists or not;
      error.statusCode = 404;
      throw error;
    }
    const resetToken = jwt.sign({userId:user._id.toString()}, process.env.RESET_PASSWORD_SECRET_KEY, {expiresIn:'1h'})
    // Here you would send the resetToken to the user's email address using an email service.
    // For demonstration purposes, we'll just return the token in the response.
    const resend = new Resend(process.env.RESEND_API_KEY);
    return resend.emails.send({
      from:'Booking-system@resend.dev',
      to:user.email,
      subject:'Password Reset',
      html:`<p>You requested a password reset.</p><p>Click <a href="http://localhost:3000/reset-password/${resetToken}">here</a> to reset your password.</p>`
    })
  }).then(data=>{
    res.status(200).json({message:'Password reset email sent successfully!', data:data})
  })
  .catch(err=>{
    next(err);
  })
}

exports.resetPassword = (req,res,next)=>{
  const newPassword = req.body.password;
  const token = req.body.token;
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    const error = new Error('Validation failed, entered data is incorrect');
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  
  const decodedToken = jwt.verify(token, process.env.RESET_PASSWORD_SECRET_KEY);
  const userId = decodedToken.userId;

    User.findById(userId)
    .then(user=>{
      if(!user){
        const error = new Error('error bad request') // For security reasons, we don't reveal whether the token is valid or not;
        error.statusCode = 400;
        throw error;
      }
      return bcrypt.hash(newPassword, 12)
      .then(hashedPassword=>{
        user.password = hashedPassword;
        return user.save();
      })
    })
    .then(result=>{
      res.status(200).json({message:'Password reset successfully!'})
    })
  .catch(err=>{next(err)})
}

exports.logout = (req,res,next)=>{
  const refreshToken = req.cookies.refreshToken;
  if(!refreshToken){
    const error = new Error('No refresh token provided');
    error.statusCode = 401;
    throw error;
  }
  let decodedToken;
  try{
    decodedToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET_KEY);
  }catch(err){
    const error = new Error('Invalid refresh token');
    error.statusCode = 401;
    throw error;
  }
  const userId = decodedToken.userId;
  User.findById(userId)
  .then(user=>{
    if(!user || user.refreshToken !== refreshToken){
      const error = new Error('Invalid refresh token');
      error.statusCode = 401;
      throw error;
    } 
    user.refreshToken = null;
    return user.save();
  })
  .then(()=>{
    res.clearCookie('refreshToken');
    res.status(200).json({message:'Logged out successfully!'})
}).catch(err=>{
  next(err);
})
}
