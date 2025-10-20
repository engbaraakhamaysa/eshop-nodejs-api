const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./src/config/db");
dotenv.config();

const app = express();
connectDB();

app.get("/", (req, res) => {
  res.send("Hello");
});

app.listen(8000, () => {
  console.log("Server running on Port 8000");
});
