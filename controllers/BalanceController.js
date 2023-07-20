const path = require("path");
const User = require(path.join(__dirname, "..", "models", "User"));
const catchAsync = require(path.join(
  __dirname,
  "..",
  "utilities",
  "catchAsync"
));
const AppError = require(path.join(__dirname, "..", "utilities", "AppError"));
const Request = require(path.join(__dirname, "..", "models", "Requests.js"));

exports.deposit = catchAsync(async (req, res, next) => {
  const { depositValue } = req.body;
  const user = await User.findById(req.user.id);
  if (!depositValue)
    return next(new AppError(400, "Please provide deposit value!"));
  //If user has already deposited money and is on 5minutes cooldown,prevent from deposit
  if (
    user.depositCooldown &&
    new Date().getTime() < user.depositCooldown.getTime()
  )
    return next(
      new AppError(400, "You can't deposit more money at the moment.")
    );

  //Ako deposit prelazi 140% userovog balansa pod uslovom da je balans pozitivan, baci error
  if (depositValue > user.balance * 1.4 && user.balance > 0)
    return next(
      new AppError(
        400,
        "You can't deposit more than 140% of your current balance!"
      )
    );
  //Ako je negativan deposit value baci error
  if (depositValue < 0) return next(400, "You can't deposit negative values");

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
  if (recipient === req.user.email)
    return next(new AppError(400, "You can't request money from yourself!"));
  const userRecipient = await User.findOne({ email: recipient });
  const user = await User.findById(req.user.id);
  if (!userRecipient)
    return next(
      new AppError(404, "Recipient not found! Please provide correct email.")
    );
  if (value > userRecipient.balance)
    return next(
      new AppError(400, "Your value is exceeding recipients balance!")
    );

  const request = await Request.create({
    recipient: userRecipient.id,
    receiver: user.id,
    value,
  });
  user.madeRequests.push(request.id);
  userRecipient.receivedRequests.push(request.id);
  await user.save({ validateBeforeSave: false });
  await userRecipient.save({ validateBeforeSave: false });

  res.status(200).json({
    status: "success",
    message: `You have successfully requested $${value} from ${userRecipient.name} ${userRecipient.surname}. He will be notified about request shortly!`,
  });
});

exports.acceptRequest = catchAsync(async (req, res, next) => {
  const { requestId } = req.params;
  const request = await Request.findById(requestId)
    .populate("recipient")
    .populate("receiver");
  if (!request)
    return next(
      new AppError(
        400,
        "Something went really wrong processing your request. Please make an request again!"
      )
    );

  if (req.user.id !== request.recipient.id)
    return next(
      new AppError(401, "You don't have permission to perform this operation.")
    );

  if (request.approved)
    return next(
      new AppError(401, "Request has been fulfilled and not valid anymore")
    );
  const recipient = await User.findById(request.recipient.id);
  const receiver = await User.findById(request.receiver.id);

  if (request.value > recipient.balance)
    return next(
      new AppError(
        400,
        `You don't have enough on your balance to accept this request! Please charge your balance. `
      )
    );
  request.approved = true;
  receiver.balance += request.value;
  recipient.balance -= request.value;
  receiver.transactions.push({
    transactionType: "deposit",
    value: request.value,
  });
  recipient.transactions.push({
    transactionType: "withdraw",
    value: request.value,
  });

  await request.save({ validateBeforeSave: false });
  await recipient.save({ validateBeforeSave: false });
  await receiver.save({ validateBeforeSave: false });

  res.status(200).json({
    status: "success",
    message: "Requested transaction approved and completed successfully",
    balance: recipient.balance,
  });
});

exports.declineRequest = catchAsync(async (req, res, next) => {
  const { requestId } = req.params;
  const request = await Request.findById(requestId)
    .populate("recipient")
    .populate("receiver");

  if (!request)
    return next(
      new AppError(400, "Something went really wrong processing your request. ")
    );
  if (request.recipient.id !== req.user.id)
    return next(
      new AppError(401, "You don't have permission to perform this operation!")
    );

  if (request.approved)
    return next(
      new AppError(
        400,
        "Request has been fulfilled already. You can't decline it now!"
      )
    );
  //dodati funkcionalnost da se obrise ovaj request i sa userovih arraysa gdje su storani napravljeni requestovi
  const recipient = await User.findById(request.recipient.id);
  const receiver = await User.findById(request.receiver.id);
  recipient.receivedRequests = recipient.receivedRequests.filter(
    (id) => id.toString() !== request.id
  );

  receiver.madeRequests = receiver.madeRequests.filter(
    (id) => id.toString() !== request.id
  );
  await recipient.save({ validateBeforeSave: false });
  await receiver.save({ validateBeforeSave: false });
  await Request.findByIdAndDelete(request.id);

  res.status(204).json({
    status: "success",
  });
});

exports.requestLoan = catchAsync(async (req, res, next) => {
  //Requestaj Loan ako nema loana
  const { loanAmount } = req.body;
  if (!loanAmount) return next(new AppError(400, "Please input loan amount"));
  //nema smisla ovo handle-ovat na backednu ali nvm
  const user = await User.findById(req.user.id);
  if (user.hasLoan)
    return next(
      new AppError(
        400,
        "You can't request a loan until you pay off your current laon!"
      )
    );
  //Ako loan prelazi 140% od ukupnog balanca, baci error
  if (loanAmount > user.balance * 1.4)
    return next(
      new AppError(
        400,
        `Loan amount exceeding account limits. Maximum amount you can  request is $${Math.round(
          user.balance * 1.4
        )}`
      )
    );

  user.loan = loanAmount;
  user.balance += loanAmount;
  user.loanRequestedAt = new Date();
  user.hasLoan = true;

  user.transactions.push({
    transactionType: "deposit",
    value: loanAmount,
  });
  await user.save({ validateBeforeSave: false });
  res.status(200).json({
    status: "success",
    message: `Loan requested successfully! Your balance is now updated wit additional $${user.loan}`,
    balance: user.balance,
  });
});

exports.payLoan = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user.loan)
    return next(new AppError(400, "You don't have any loans to pay off!"));

  user.transactions.push({
    transactionType: "withdraw",
    value: user.loan,
  });
  user.hasLoan = false;
  user.balance -= user.loan;
  user.loan = 0;
  await user.save({ validateBeforeSave: false });
  return res.status(200).json({
    status: "success",
    message: "Loan successfully paid off!",
    balance: user.balance,
  });
});
