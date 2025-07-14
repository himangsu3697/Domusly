const mongoose = require("mongoose");
const Review = require("./review.js");
const wrapAsync = require("../utils/wrapAsync.js");
const listingSchema = mongoose.Schema({
    title : {
        type : String,
        required : true,
    },
    description : {
        type : String,
        required : true,
    },
    image : {
        url : String,
        filename : String,
    },
    price : {
        type : Number,
        required : true,
        min : 0,
    },
    location : {
        type : String,
        required : true,
    },
    country : {
        type : String,
        required : true,
    },
    reviews : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Review"
    }],
    owner : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
    },
    category : {
        type : String,
        enum : ["trending", "rooms", "iconic_cities", "mountains", "castles", "amazing_pools", "camping", "farms", "arctic", "domes", "boats"],
        required : true,
    }
});

//middleware to handel the delision of the reviews with the listing
listingSchema.post("findOneAndDelete",wrapAsync(async (listing) => {
    if(listing.reviews.length>0) {
        await Review.deleteMany({_id : {$in : listing.reviews}});
    }
}));

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;

