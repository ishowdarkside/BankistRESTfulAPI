const express = require("express");
const Router = express.Router();
const path = require("path");
const { signup, login, protect } = require(path.join(
  __dirname,
  "..",
  "controllers",
  "AuthController.js"
));

Router.post("/signup", signup);
Router.post("/login", /*login*/ protect);
module.exports = Router;
