const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const { useCallback } = require("react");

require("dotenv").config();

//setting express
const app = express();

app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 50000;

app.listen(PORT, () => {
  console.log(`Server started successfully on ${PORT}.`);
});

//Mongoose setup
const uri = process.env.ATLAS_URI;
mongoose.connect(
  uri,
  { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true },
  (err) => {
    if (err) throw err;
  }
);

const connection = mongoose.connection;

connection.once("open", () => {
  console.log("MongoDB is connected");
});

//Routes
app.use("/users", require("./routes/user.route"));
app.use("/todos", require("./routes/todo.route"));
