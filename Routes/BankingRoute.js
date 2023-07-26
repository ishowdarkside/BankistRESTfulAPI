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
  requestLoan,
  payLoan,
} = require(path.join(__dirname, "..", "controllers", "BalanceController.js"));

Router.patch("/deposit", protect, deposit);
Router.patch("/withdraw", protect, withdraw);
Router.patch("/request", protect, makeRequest);
Router.get("/request/:requestId", protect, acceptRequest);
Router.get("/request/decline/:requestId", protect, declineRequest);
Router.post("/requestLoan", protect, requestLoan);
Router.get("/payLoan", protect, payLoan);

module.exports = Router;
