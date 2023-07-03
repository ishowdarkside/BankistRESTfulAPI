const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
dotenv.config({ path: "./config.env" });
const app = express();
//User Router
const UserRouter = require("./Routes/UserRoute");

//Morgan Setup
app.use(morgan("dev"));

//Using User Routing
app.use("/api/users", UserRouter);

//Handling unhandled Routes
app.use("*", (req, res, next) => {
  res.status(404).json({ status: "fail", message: "Whoops, route not found!" });
});

module.exports = app;
