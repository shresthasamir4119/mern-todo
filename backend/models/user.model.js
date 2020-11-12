const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  displayName: {
    type: String,
    required: false,
    minlength: 3,
  },
});

const User = mongoose.model("user", userSchema);

module.exports = User;
