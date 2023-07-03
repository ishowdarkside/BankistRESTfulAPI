const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const GlobalErrorMiddleware = require("./controllers/ErorrController");
dotenv.config({ path: "./config.env" });
const app = express();
//User Router
const UserRouter = require("./Routes/UserRoute");

//Morgan Setup
app.use(morgan("dev"));

//Parsing incoming JSON
app.use(express.json());

//Using User Routing
app.use("/api/users", UserRouter);

//Handling unhandled Routes
app.use("*", (req, res, next) => {
  res.status(404).json({ status: "fail", message: "Whoops, route not found!" });
});

//Catching all Errors in Global Error middleware function
app.use(GlobalErrorMiddleware);

module.exports = app;
