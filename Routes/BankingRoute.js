const express = require("express");
const Router = express.Router();
const path = require("path");
const { protect } = require(path.join(
  __dirname,
  "..",
  "controllers",
  "AuthController.js"
));
const {
  deposit,
  withdraw,
  makeRequest,
  acceptRequest,
  declineRequest,
} = require(path.join(__dirname, "..", "controllers", "BalanceController.js"));

Router.patch("/deposit", protect, deposit);
Router.patch("/withdraw", protect, withdraw);
Router.patch("/request", protect, makeRequest);
Router.get("/request/:requestId", protect, acceptRequest);
Router.delete("/request/decline/:requestId", protect, declineRequest);

module.exports = Router;
