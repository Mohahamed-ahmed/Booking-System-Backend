const mongoose = require("mongoose");

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    return;
  }

  try {
    await mongoose.connect(process.env.MONGO_URL);

    isConnected = true;

    console.log("MongoDB connected");
  } catch (err) {
    console.log(err);
    throw err;
  }
};

module.exports = connectDB;