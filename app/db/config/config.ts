import mongoose from "mongoose";
require("dotenv").config();

exports.connect = () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error("MONGO_URI is not configured.");
  }

  mongoose
    .connect(mongoUri)
    .then(() => {
      console.log("Connected to Database!");
    })
    .catch((error) => {
      console.error("Error connecting to database:", error.message);
      console.error("Stack trace:", error.stack);
    });

};
