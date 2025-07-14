const Listing = require("../models/listing.js");

module.exports.isLoggedin = (req, res, next) => {
    if(!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in to create a listing");
        return res.redirect("/users/login");
    } 
    next();
}

module.exports.saveRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async(req, res, next) => {
    const {id} = req.params;
    let listing = await Listing.findById(id);
    if(!(res.locals.user && listing.owner._id.equals(res.locals.user._id))) {
        req.flash("error","You are not the owner of the listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
}





