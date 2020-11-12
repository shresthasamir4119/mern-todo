const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
  todo: {
    type: String,
    required: true,
    unique: true,
  },
  isCompleted: {
    type: Boolean,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
});

const Todo = mongoose.model("todo", todoSchema);

module.exports = Todo;
