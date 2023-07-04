const mongoose = require("mongoose");

const RequestSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  value: { type: Number },
  requestDate: { type: Date, default: new Date() },
  approved: { type: Boolean, default: false },
});

const Request = mongoose.model("Request", RequestSchema);

module.exports = Request;
