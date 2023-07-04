const express = require("express");
const Router = express.Router();
const path = require("path");
const { protect } = require(path.join(
  __dirname,
  "..",
  "controllers",
  "AuthController.js"
));
const { deposit, withdraw } = require(path.join(
  __dirname,
  "..",
  "controllers",
  "BalanceController.js"
));

Router.patch("/deposit", protect, deposit);
Router.patch("/withdraw", protect, withdraw);

module.exports = Router;
