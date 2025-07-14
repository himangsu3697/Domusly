const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const {saveRedirectUrl} = require("../utils/middlewares.js");
const { getSignupForm, createUser, getLoginForm, loginUser, logoutUser } = require("../controllers/user.js");


//route to get the signup form
router.get("/signup", getSignupForm);

//route to create a user 
router.post("/signup", wrapAsync(createUser));

//route to get login form
router.get("/login", getLoginForm);

//route to login
router.post("/login", saveRedirectUrl,
    passport.authenticate("local",{failureRedirect : "/users/login",failureFlash : true}), 
    wrapAsync(loginUser));

//route to logout
router.get("/logout", logoutUser);

module.exports = router;




