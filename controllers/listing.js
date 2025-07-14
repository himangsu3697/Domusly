const Listing = require("../models/listing.js");
const ExpressError = require("../utils/expressErrors.js");

//index controller
module.exports.index = async (req, res) => {
    const listings = await Listing.find({});
    res.render("./listing/index.ejs", { listings });
};

//create form controller
module.exports.newForm = (req, res) => {
    res.render("./listing/new.ejs");
};

//show controller
module.exports.showListing = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({ path: "reviews", populate: { path: "author" } })
        .populate("owner");
    if (!listing) {
        throw new ExpressError(401, "Listing dosnot exist");
    }
    res.render("./listing/show.ejs", { listing });
};

//create controller 
module.exports.createListing = async (req, res) => {
    if (!req.body.listing) {
        throw new ExpressError(400, "Send Valid Data For Listing");
    }
    let url = req.file.path;
    let filename = req.file.filename;
    let newListing = new Listing({ ...req.body.listing, owner: req.user._id});
    newListing.image = { url, filename };
    await newListing.save();
    req.flash("success", "New Listing Created");
    res.redirect("/listings");
};

//edit form controller
module.exports.editForm = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing dosnot exist");
    }
    res.render("./listing/edit.ejs", { listing });
};

//update controler
module.exports.updateListing = async (req, res) => {
    const { id } = req.params;
    const updatedListing = req.body.listing;
    if (req.file) {
        let url = req.file.path;
        let filename = req.file.filename;
        updatedListing.image = { url, filename };
    }
    await Listing.findByIdAndUpdate(id, updatedListing, { runValidators: true });
    req.flash("success", "Listing Updated");
    res.redirect(`/listings/${id}`);
};

//delete controller 
module.exports.deleteListing = async (req, res) => {
    const { id } = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted");
    res.redirect("/listings");
}


//filter listing controller
module.exports.filter = async(req, res) => {
    const {category} = req.params;
    const listings = await Listing.find({category : category})
    .populate({path : "reviews", populate : {path : "author"}}).populate("owner");
    if(!listings.length>0) {
        req.flash("error", "Listing for this category dosent exist");
        return res.redirect("/listings");
    }
    res.render("./listing/index.ejs", {listings});
};

//search listing controller 
module.exports.search = async(req, res) => {
    const {country} = req.query;
    const listings = await Listing.find({country : country})
    .populate({path : "reviews",populate : {path : "author"}}).populate("owner");
    if(!listings.length>0) {
        req.flash("error", "Listing for this country dosent exist");
        return res.redirect("/listings");
    }
    res.render("./listing/index.ejs", {listings});
};

