const path = require("path");
const AppError = require(path.join(
  __dirname,
  "..",
  "utilities",
  "AppError.js"
));
const catchAsync = require(path.join(
  __dirname,
  "..",
  "utilities",
  "catchAsync.js"
));

exports.signup = (req, res, next) => {
  res.status(200).json({});
};
