if(process.env.NODE_ENV != "production") {
    require("dotenv").config();
}
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");            
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const ExpressError = require("./utils/expressErrors.js");
const session = require("express-session");
const mongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStratege = require("passport-local");
const userRouter = require("./routes/user.js");
const User = require("./models/user.js");

//create express app
const app = express();
const port = 3000;

//setup ejs
app.set("view engin", "ejs");
app.set("views", path.join(__dirname, "/views"));

//setup ejs mate
app.engine("ejs", ejsMate);


//connect with the mongoDB database
async function main() {
    await mongoose.connect(process.env.ATLASDB_URL);
}

main().then((res) => {
    console.log("Connection Successfull..");
}).catch((err) => {
    console.log(err);
});

//mongo store setup
const store = mongoStore.create({
    mongoUrl : process.env.ATLASDB_URL,
    crypto : {
        secret : process.env.SECRET,
    },
    touchAfter : 24*3600,
});

store.on("error", () => {
    console.log("Error in mongo session store", err);
});

//session options
const sessionOption = {
    store : store,
    secret : process.env.SECRET,
    resave : false,
    saveUninitialized : true,
    cookie : {
        expires : Date.now() + 7*24*60*60*1000,
        maxAge : 7*24*60*60*1000,
        httpOnly : true,
    }
};

//middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(session(sessionOption));
app.use(flash());

//setup pasport 
app.use(passport.initialize());  //initialized the passport
app.use(passport.session());    //informing pasport about the current session
passport.use(new LocalStratege(User.authenticate())); //authenticate the user
passport.serializeUser(User.serializeUser());  // to store user information in the session
passport.deserializeUser(User.deserializeUser());  //to remove user infomarmation from the session

//to save the message in the locals
app.use((req, res , next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.user = req.user;
    next();
});


//listing routes
app.use("/listings",listingRouter);

//review routes
app.use("/listings", reviewRouter);

//user routes
app.use("/users",userRouter);

//route for request send in invalid route
app.use((req, res, next) => {
    next(new ExpressError(404,"Page Note Found"));
});

//error handling middleware
app.use((err, req, res, next) => {
    let {statusCode = 500 , message = "Something Went Wrong"} = err;
    res.status(statusCode).render("./listing/error.ejs",{message});
});

//Server is listning
app.listen(port, () => {
    console.log(`App is Listning at port : ${port}`);
});


