const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const ExpressError = require("../utils/ExpressError");

const isLoggedIn = async (req, res, next) => {
    let token = req.cookies.token;
        
    if (token) {
        const data = jwt.verify(token, process.env.JWT_SECRET);
     
        const user = await User.findById(data.id)
        req.user = user;
        next();
    } else {
        next(new ExpressError(401, "Please, Login to access this resource"));
    }
}

const fieldsChecking = async (req, res, next) => {
    let { name, email, password } = req.body;
    
    if (!name || !email || !password) {
        return next(new ExpressError(400, "All fields are required."));
    }

    const user = await User.findOne({ email });
    if (user !== "") {
        return next(new ExpressError(400, "A user with given Email already exists."));
    }

    next();
}

module.exports = {
    isLoggedIn,
    fieldsChecking
}