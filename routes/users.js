const express = require("express");
const router = express.Router();
const users = require("../controllers/users");
const catchAsync = require("../Utilities/catchAsync");
const passport = require("passport");
const { storeReturnTo } = require("../middleware");

router
  .route("/register")
  .get(users.renderRegister)
  .post(catchAsync(users.register));

router
  .route("/login")
  .get(users.renderLogin)
  .post(
    storeReturnTo,
    passport.authenticate("local", {
      //authenticate() method
      failureFlash: true,
      failureRedirect: "/login",
    }),
    users.login
  );

router.get("/logout", users.logout);

module.exports = router;
