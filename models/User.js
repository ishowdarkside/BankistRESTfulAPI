const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: [3, "Name must contain at least 3 letters!"],
    maxlength: [30, "Name can contain 30 letters maximum!"],
    required: [true, "Please provide your name!"],
    validate: {
      validator: function (value) {
        return value.match(/^[A-Za-z\s]+$/);
      },
      message: "Name can only contain letters!",
    },
  },
  surname: {
    type: String,
    minlength: [3, "Surname must contain at least 3 letters!"],
    maxlength: [30, "Surname can contain 30 letters maximum!"],
    required: [true, "Please provide your surname!"],
    validate: [
      {
        validator: function (value) {
          return value.match(/^[A-Za-z\s]+$/);
        },
        message: "Surname can only contain letters!",
      },
    ],
  },

  email: {
    type: String,
    required: [true, "Please provide email adress!"],
    unique: [true, "Email already in use!"],
    validate: {
      validator: function (value) {
        return value.match(/^[\w\.-]+@[\w\.-]+\.\w+$/);
      },
      message: "Invalid email address!",
    },
  },

  password: {
    type: String,
    minlength: [6, "Password must contain at least 6 letters!"],
    maxlength: [30, "Password cannot be larger than 30 letters!"],
    required: [true, "Please provide password!"],
    validate: {
      validator: function (value) {
        return !value.includes(" ");
      },
      message: "Password cannot contain spaces!",
    },
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please provide password confirm"],
    validate: {
      validator: function (value) {
        return value === this.password;
      },
      message: "Passwords are not matching!",
    },
  },
  birthYear: {
    type: String,
    required: [true, "Please provide birth year!"],
  },
  balance: {
    type: Number,
    default: 0,
  },
  loan: {
    type: Number,
    default: 0,
  },
  depositCooldown: {
    type: Date,
  },
  withdrawCooldown: {
    type: Date,
  },
  transactions: [
    {
      transactionDate: {
        type: Date,
        default: new Date(),
      },
      transactionType: {
        type: String,
        enum: ["deposit", "withdraw", "request"],
      },
      value: {
        type: Number,
      },
    },
  ],
  receivedRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "Request" }],
  madeRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "Request" }],
  hasLoan: {
    type: Boolean,
    default: false,
  },
  loanRequestedAt: {
    type: Date,
  },
});

UserSchema.pre("save", async function (next) {
  if (!this.isNew) return next();
  if (!this.isModified("password")) next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

UserSchema.pre("save", function (next) {
  if (!this.isNew) return next();
  //this.birthYear = new Date(this.birthYear).toISOString();
  next();
});

UserSchema.statics.checkAllFields = function (body) {
  const { name, surname, password, passwordConfirm, birthYear } = body;
  if (!name || !surname || !password || !passwordConfirm || !birthYear)
    return false;
  else return true;
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
