const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const GlobalErrorMiddleware = require("./controllers/ErorrController");
const cookieParser = require("cookie-parser");
dotenv.config({ path: "./config.env" });
const app = express();

const UserRouter = require("./Routes/UserRoute");
const BankingRouter = require("./Routes/BankingRoute");

//Morgan Setup
app.use(morgan("dev"));

//Parsing incoming JSON
app.use(express.json());

//Prase cookies
app.use(cookieParser());

//Using User Routing
app.use("/api/users", UserRouter);
app.use("/api/banking", BankingRouter);

//Handling unhandled Routes
app.use("*", (req, res, next) => {
  res.status(404).json({ status: "fail", message: "Whoops, route not found!" });
});

//Catching all Errors in Global Error middleware function
app.use(GlobalErrorMiddleware);

module.exports = app;
