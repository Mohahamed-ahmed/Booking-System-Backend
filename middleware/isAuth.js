const jwt = require('jsonwebtoken')
const dotenv = require('dotenv').config();

exports.isAuth = (req,res,next)=>{
    let decodedToken;
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1]; // Extract token from "Bearer <token>"
    if(!token){
        const error = new Error('Not authenticated');
        error.statusCode = 401;
        throw error;
    }
    try{
        decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const userId = decodedToken.userId;
        if(!userId){
            const error = new Error('Not authenticated');
            error.statusCode = 401;
            throw error;
        }
        req.userId = decodedToken.userId; // Attach userId to the request object for later use
        req.userRole = decodedToken.role; // Attach user role to the request object for later use
        next();
        
    }catch(err){
        const error = new Error('Not authenticated');
        error.statusCode = 401;
        throw error;
    }
}