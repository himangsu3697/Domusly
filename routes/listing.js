const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedin, isOwner } = require("../utils/middlewares.js");
const { index, newForm, showListing, createListing, editForm, updateListing, deleteListing, filter, search } = require("../controllers/listing.js");
const multer = require("multer");
const {storage} = require("../cloud_config.js");
const uploade = multer({storage});

//index route to show all the listings
router.get("/", wrapAsync(index));

//to get form for crete new listing
router.get("/new", isLoggedin, newForm);

//route to search a isting by a country
router.get("/search", wrapAsync(search));

//show route to show an individual listing
router.get("/:id", wrapAsync(showListing));

//to create new listing
router.post("/", isLoggedin, uploade.single("listing[image]"), wrapAsync(createListing));

//Edit route to get form for Edit a listing
router.get("/:id/edit", isLoggedin, isOwner, wrapAsync(editForm));

//Update route to update a listing 
router.put("/:id", isLoggedin, isOwner, uploade.single("listing[image]"), wrapAsync(updateListing));

//Delete route to delete a listing
router.delete("/:id",isLoggedin, isOwner, wrapAsync(deleteListing));

//route to show listings of a specific category
router.get("/:category/filter", wrapAsync(filter));


module.exports = router;



