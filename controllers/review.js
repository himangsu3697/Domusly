const Listing = require("../models/listing");
const Review = require("../models/review.js");
const ExpressError = require("../utils/expressErrors.js");

//createReview controller
module.exports.createReview = async (req, res) => {
    if(!req.body.review) {
        throw new ExpressError(400,"Please Send a Valid Review");
    }
    const {id} = req.params;
    const newReview = new Review(req.body.review);
    const listing = await Listing.findById(id);
    listing.reviews.push(newReview);
    newReview.author = req.user._id;
    await newReview.save();
    await listing.save();
    req.flash("success", "New Review Created");
    res.redirect(`/listings/${id}`);
};

//deleteReview controller
module.exports.deleteReview = async (req, res) => {
    const {id, revId} = req.params;
    let listing = await Listing.findById(id);
    let review = await Review.findById(revId);
    if(!res.locals.user._id.equals(review.author._id)) {
        req.flash("error","You are not the owner of the review");
        return res.redirect(`/listings/${id}`);
    }
    await Review.findByIdAndDelete(revId);
    listing.reviews = listing.reviews.filter((v) => v!=revId);
    await listing.save();
    req.flash("success", "Review Deleted");
    res.redirect(`/listings/${id}`);
};
