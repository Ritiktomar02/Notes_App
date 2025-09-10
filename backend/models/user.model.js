const mongoose = require("mongoose");

// Define the schema fields
const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,          // make it mandatory
      trim: true,              // remove leading/trailing spaces
    },
    email: {
      type: String,
      required: true,
      unique: true,            // no duplicate emails
      lowercase: true,         // always store in lowercase
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, 
  }
);

module.exports=mongoose.model("User",userSchema);
