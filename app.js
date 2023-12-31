if (process.env.NODE_ENV !== "production") {
  //if we use Node Environment Variable in Development, Instead of Production
  require('dotenv').config(); //if we upload our App at other Platforms, then do not upload the env file.
}

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate"); //ejs Package for Layouts
const flash = require("connect-flash");
const mongoSanitize = require("express-mongo-sanitize"); //removes keys from query, which contain Prohibited Characters.  Ex- '$gt'  etc.
const ExpressError = require("./Utilities/ExpressError");
const methodOverride = require("method-override");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
// const helmet = require("helmet");  //package of group of middlewares for Security Purpose   //we can Set HTTP response Headers

const session = require("express-session");
const MongoStore = require("connect-mongo");

// const dbUrl = "mongodb://127.0.0.1:27017/yelp-camp";
// mongoose
//   .connect(dbUrl)
//   .then(() => {
//     console.log("Database Connected");
//   })
//   .catch((e) => {
//     console.log(e);
//   });

const userRoutes = require("./routes/users");
const campgroundRoutes = require("./routes/campgrounds.js");
const reviewRoutes = require("./routes/reviews.js");

const app = express();

app.engine("ejs", ejsMate);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true })); //parse urlencoded form-data
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  mongoSanitize({
    replaceWith: "_", //replace the signs ($) in the query with '_'
  })
);

// const store = MongoStore.create({
//   mongoUrl: dbUrl,
//   touchAfter: 24 * 60 * 60,
//   crypto: {
//     secret: "thisshouldbeabettersecret",
//   },
// });

// store.on("error", function (e) {
//   console.log("Session Store Error!", e);
// });

const sessionConfig = {
  //store,
  name: "Session",
  secret: "thisshouldbeabettersecret!",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    // secure: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfig));
app.use(flash());

// app.use(helmet());

// const scriptSrcUrls = [                        //Urls from different origin
//   "https://stackpath.bootstrapcdn.com/",
//   "https://api.tiles.mapbox.com/",
//   "https://api.mapbox.com/",
//   "https://kit.fontawesome.com/",
//   "https://cdnjs.cloudflare.com/",
//   "https://cdn.jsdelivr.net",
// ];
// const styleSrcUrls = [
//   "https://kit-free.fontawesome.com/",
//   "https://stackpath.bootstrapcdn.com/",
//   "https://api.mapbox.com/",
//   "https://api.tiles.mapbox.com/",
//   "https://fonts.googleapis.com/",
//   "https://use.fontawesome.com/",
// ];
// const connectSrcUrls = [
//   "https://api.mapbox.com/",
//   "https://a.tiles.mapbox.com/",
//   "https://b.tiles.mapbox.com/",
//   "https://events.mapbox.com/",
// ];
// const fontSrcUrls = [];
// app.use(
//   helmet.contentSecurityPolicy({
//     directives: {
//       defaultSrc: [],
//       connectSrc: ["'self'", ...connectSrcUrls],
//       scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
//       styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
//       workerSrc: ["'self'", "blob:"],
//       objectSrc: [],
//       imgSrc: [
//         "'self'",
//         "blob:",
//         "data:",
//         "https://res.cloudinary.com/dvhq7zxwd/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT!
//         "https://images.unsplash.com/",
//       ],
//       fontSrc: ["'self'", ...fontSrcUrls],
//     },
//   })
// );

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser()); //How to Store in the Session
passport.deserializeUser(User.deserializeUser()); //How to Unstore in the Session

app.use((req, res, next) => {
  //res.locals- it allows us to store variables that can be accessed by our templates and other middleWare functions.
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.use("/", userRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/reviews", reviewRoutes);

app.get("/", (req, res) => {
  res.render("home");
});

app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found!", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) {
    err.message = "Oh No, Something Went Wrong!";
  }
  res.status(statusCode).render("error", { err });
});

app.listen(3500, () => {
  console.log("Serving on port 3500");
});
