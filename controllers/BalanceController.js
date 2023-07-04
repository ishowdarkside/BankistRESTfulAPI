const path = require("path");
const User = require(path.join(__dirname, "..", "models", "User"));
const catchAsync = require(path.join(
  __dirname,
  "..",
  "utilities",
  "catchAsync"
));
const AppError = require(path.join(__dirname, "..", "utilities", "AppError"));

exports.deposit = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!req.body.depositValue)
    return next(new AppError(400, "Please provide deposit value!"));
  //If user has already deposited money and is on 5minutes cooldown,prevent from deposit
  if (
    user.depositCooldown &&
    new Date().getTime() < user.depositCooldown.getTime()
  )
    return next(
      new AppError(400, "You can't deposit more money at the moment.")
    );
  if (req.body.depositValue > user.balance * 1.4)
    return next(
      new AppError(
        400,
        "You can't deposit more than 140% of your current balance!"
      )
    );
  user.balance = user.balance + req.body.depositValue;
  //Add 5 minutes cooldown
  user.depositCooldown = new Date(new Date().getTime() + 5 * 60000);
  //add current movement to transactions array
  user.transactions.push({
    transactionDate: Date.now(),
    transactionType: "deposit",
    value: req.body.depositValue,
  });
  await user.save({ validateBeforeSave: false });
  res.status(200).json({
    status: "success",
    balance: user.balance,
  });
});

exports.withdraw = catchAsync(async (req, res, next) => {
  const { withdrawValue } = req.body;
  const user = await User.findById(req.user.id);

  //If value isn't provided,throw error
  if (!withdrawValue)
    return next(
      new AppError(400, "Please provide value in order to withdraw the money!")
    );

  //If user is on cooldown,throw error
  if (
    user.withdrawCooldown &&
    new Date().getTime() < user.withdrawCooldown.getTime()
  )
    return next(new AppError(400, "You can't withdraw money at the moment!"));

  //If user try to withdraw more than balance value,throw error
  if (withdrawValue > user.balance)
    return next(
      new AppError(
        400,
        `You don't have enough money to withdraw $${withdrawValue}!`
      )
    );
  //If user tries to withdraw more than 60% of the balance,throw error
  if (withdrawValue > user.balance * 0.6)
    return next(
      new AppError(
        400,
        "You can't withdraw more than 60% of your balance at once!"
      )
    );
  //else, take money from balance,update withdrawCooldown,put transaction into array
  user.balance -= withdrawValue;
  user.withdrawCooldown = new Date(new Date().getTime() + 5 * 60000);
  user.transactions.push({
    transactionDate: new Date(),
    transactionType: "withdraw",
    value: withdrawValue,
  });
  await user.save({ validateBeforeSave: false });
  res.status(200).json({
    status: "success",
    balance: user.balance,
  });
});

exports.makeRequest = catchAsync(async (req, res, next) => {
  const { recipient, value } = req.body;
  if (!recipient || !value)
    return next(new AppError(400, "Please provide recipient and value"));
});
