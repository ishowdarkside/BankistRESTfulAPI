const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    maxlength: 30,
    validate: {
      validator: function (value) {
        return value.test(/^[A-Za-z\s]+$/);
      },
      message: "Name can only contain letter!",
    },
  },
  surname: {
    type: String,
    minlength: 3,
    maxlength: 30,
  },
});

const User = mongoose.Model("User", UserSchema);

module.exports = User;
