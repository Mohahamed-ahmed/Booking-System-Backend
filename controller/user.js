const User = require('../models/user')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv').config();

exports.getUserProfile = (req,res,next)=>{
    let decodedToken;
    try{
        decodedToken = jwt.verify(req.headers.authorization.split(' ')[1], process.env.JWT_SECRET_KEY);
    }catch(err){
        const error = new Error('Not authenticated');
        error.statusCode = 401;
        throw error;
    }
    const userId = decodedToken.userId;
    User.findById(userId)
    .then(user=>{
        if(!user){
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }
        let userData = {
            name: user.name,
            email: user.email,
        }
        res.status(200).json({ userData });
    })
    .catch(err=>{
        next(err);
    })
}
exports.getuserById = (req,res,next)=>{
    const userId = req.params.id;
    User.findById(userId)
    .then(user=>{
        if(!user){
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }
        let userData = {
            name: user.name,
            email: user.email,
        }
        res.status(200).json({ userData });
    })
    .catch(err=>{
        next(err);
    })
}