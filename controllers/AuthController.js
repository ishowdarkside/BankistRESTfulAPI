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
const bcrypt = require("bcrypt");

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

exports.login = catchAsync(async (req, res, next) => {
  if (!req.body.email || !req.body.password)
    return next(new AppError(401, "Please provide email and password!"));
  const user = await User.findOne({ email: req.body.email });
  if (!user) return next(new AppError(401, "Invalid email/password!"));

  const compared = await bcrypt.compare(req.body.password, user.password);
  if (!compared) return next(new AppError(401, "Invalid email/password"));
  const token = await generateToken(user.id);
  res.cookie("jwt", token, { httpOnly: true, secure: true });
  return res.status(200).json({
    status: "success",
    message: "Authorized",
    token,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  const { jwt: token } = req.cookies;
  if (!token)
    return next(new AppError(401, "You are not logged in! Please login."));

  const verified = await jwt.verify(token, process.env.JWT_SECRET);
  if (!verified)
    return next(new AppError(401, "JSON Token malformed. Please login again!"));
  const user = await User.findById(verified.data);
  if (!user)
    return next(
      new AppError(
        401,
        "User who the token belongs to, doesnt exist anymore. Please login again!"
      )
    );
  next();
});
