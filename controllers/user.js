const User = require("../models/user");

//signup form controller
module.exports.getSignupForm = (req, res) => {
    res.render("./user/signup.ejs");
};

//create user controller
module.exports.createUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        let newUser = new User({
            username: username,
            email: email
        });
        await User.register(newUser, password);
        req.flash("success", "Signup is Successful");
        res.redirect("/users/login");
    } catch(err) {
        req.flash("error",err.message);
        res.redirect("/users/signup");
    }
};

//login form controller
module.exports.getLoginForm = (req, res) => {
    res.render("./user/login.ejs");
};

//user login controller 
module.exports.loginUser = async (req, res) => {
    req.flash("success","Welcome to Domusly");
    if(res.locals.redirectUrl) {
        res.redirect(res.locals.redirectUrl);
    }
    else {
        res.redirect("/listings");
    }
};

//user logout controller
module.exports.logoutUser = (req, res, next) => {
    req.logOut((err) => {
        if(err) {
            return next(err);
        }
        req.flash("success", "You are Logged out");
        res.redirect("/listings");
    });
};

