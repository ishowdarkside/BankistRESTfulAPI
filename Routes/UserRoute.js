const express = require("express");
const Router = express.Router();
const path = require("path");
const {
  signup,
  login,
  protect,
  checkAdmin,
  verify,
  getUserData,
} = require(path.join(__dirname, "..", "controllers", "AuthController.js"));
const { deposit } = require(path.join(
  __dirname,
  "..",
  "controllers",
  "BalanceController.js"
));

Router.post("/signup", signup);
Router.post("/login", login);
Router.get("/verify", verify);
Router.get("/userData", protect, getUserData);

module.exports = Router;
