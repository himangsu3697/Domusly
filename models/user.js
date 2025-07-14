const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
    email : {
        type : String,
        required : true
    }
});

userSchema.plugin(passportLocalMongoose); //it will add the user and hashed password
const User = mongoose.model("User",userSchema);

module.exports = User;

