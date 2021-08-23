const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "user must have a username"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "user must have a password"],
    },
  },
  { timestamps: true }
);

// userSchema.pre("save", ())

const User = mongoose.model("User", userSchema);
module.exports = User;
