const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const GlobalErrorMiddleware = require("./controllers/ErorrController");
const cookieParser = require("cookie-parser");
dotenv.config({ path: "./config.env" });
const cors = require("cors");
const path = require("path");
const app = express();

const UserRouter = require("./Routes/UserRoute");
const BankingRouter = require("./Routes/BankingRoute");

//Prase cookies
app.use(cookieParser());
//enable cors
app.use(cors({ credentials: true, origin: "http://localhost:5173" }));

//Morgan Setup
app.use(morgan("dev"));

//Parsing incoming JSON
app.use(express.json());

//Using User Routing
app.use("/api/users", UserRouter);
app.use("/api/banking", BankingRouter);

//Handling unhandled Routes

//serve static files
app.use(express.static("./public/dist"));
app.use("*", (req, res, next) => {
  res.sendFile(path.join(__dirname, "public", "dist", "index.html"));
});
//Catching all Errors in Global Error middleware function
app.use(GlobalErrorMiddleware);

module.exports = app;
