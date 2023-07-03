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
const jwt = require("jsonwebtoken");
const User = require(path.join(__dirname, "..", "models", "User"));

async function generateToken(id) {
  const token = await jwt.sign({ data: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });

  return token;
}

exports.signup = catchAsync(async (req, res, next) => {
  if (!User.checkAllFields(req.body))
    return next(new AppError(400, "Please provide all fields"));
  const { name, surname, password, passwordConfirm, birthYear, email } =
    req.body;

  const user = await User.create({
    name,
    surname,
    password,
    passwordConfirm,
    birthYear,
    email,
  });
  const token = await generateToken(user._id);
  res.status(200).json({
    statsu: "success",
    message: "User registered successfully!",
    token,
  });
});
