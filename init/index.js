const mongoose = require("mongoose");
let initdata = require("./data.js");
const Listing = require("../models/listing.js");

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/major_project");
}

main().then(() => {
    console.log("connection Successfull..");
})
.catch((err) => {
    console.log(err);
});
const category = ["trending", "rooms", "iconic_cities", "mountains", "castles", "amazing_pools", "camping", "farms", "arctic", "domes", "boats"];
const initDB = async() => {
    await Listing.deleteMany({}); 
    initdata.data = initdata.data.map((obj) => ({...obj,owner : "687353f3c3ead335d72c41d2",category : category[Math.floor(Math.random()*11)] }));
    await Listing.insertMany(initdata.data);
    console.log("Data initilized Successfully..");
}

initDB();


