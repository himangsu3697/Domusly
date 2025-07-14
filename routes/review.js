const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js")
const { isLoggedin } = require("../utils/middlewares.js");
const { createReview, deleteReview } = require("../controllers/review.js");

//reviews
//route to create a review 
router.post("/:id/reviews", isLoggedin, wrapAsync(createReview));

//route to delete a riview 
router.delete("/:id/reviews/:revId", isLoggedin, wrapAsync(deleteReview));

module.exports = router;
