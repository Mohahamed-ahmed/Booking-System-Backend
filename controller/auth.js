const User = require("../models/user");
const bcrypt = require("bcrypt");
const { validationResult } = require('express-validator');

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
      console.log("Error hashing password:", err);
    });
};
