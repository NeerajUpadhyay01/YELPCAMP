const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const Campground = require("../models/campground");

mongoose
  .connect("mongodb://127.0.0.1:27017/yelp-camp")
  .then(() => {
    console.log("Database Connected");
  })
  .catch((e) => {
    console.log(e);
  });

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000) + 1;
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      author: "64927df1d72c0c6a40fbd178",
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      description: "lorem epsum chdsk msld? fsju dkxs adsus ksnas df.",
      price,
      images: [
        {
          url: "https://res.cloudinary.com/dvhq7zxwd/image/upload/v1687362605/YelpCamp/drbqyioh2jumhdqqtiok.jpg",
          filename: "YelpCamp/drbqyioh2jumhdqqtiok",
        },
        {
          url: "https://res.cloudinary.com/dvhq7zxwd/image/upload/v1687362606/YelpCamp/ainreqo5pwd2nctgqdps.jpg",
          filename: "YelpCamp/ainreqo5pwd2nctgqdps",
        },
        {
          url: "https://res.cloudinary.com/dvhq7zxwd/image/upload/v1687362608/YelpCamp/slgl1f6vzrch8qyqxvsy.jpg",
          filename: "YelpCamp/slgl1f6vzrch8qyqxvsy",
        },
      ],
    });
    await camp.save();
  }
};
seedDB().then(() => {
  mongoose.connection.close();
});
