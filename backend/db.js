const mongoose = require("mongoose");
require("dotenv").config();

module.exports = async () => {
  try {
    const uri = process.env.DATABASE_URI;
    if (!uri) throw new Error("DATABASE_URI is not defined in .env file");

    await mongoose.connect(uri);
    console.log("Connected to database successfully.");
  } catch (error) {
    console.error("Database not connected:", error.message);
    process.exit(1);
  }
};
