const express = require("express");
const Router = express.Router();
const path = require("path");
const { signup } = require(path.join(
  __dirname,
  "..",
  "controllers",
  "AuthController.js"
));

Router.route("/").post(signup);

module.exports = Router;
