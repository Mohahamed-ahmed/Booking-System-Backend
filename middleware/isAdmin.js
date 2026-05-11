exports.isAdmin = (req,res,next)=>{
    const userRole = req.userRole; // Assuming userRole is set in the isAuth middleware
    if(userRole !== 'admin'){
        const error = new Error('Forbidden: Admins only');
        error.statusCode = 403;
        return next(error);
    }
    next();
}