const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongooDB Connected Successfully");
  } catch (err) {
    console.error("DB Connection Failed:", err.message);

    process.exit(1); // Stop run program
  }
};
module.exports = connectDB;
