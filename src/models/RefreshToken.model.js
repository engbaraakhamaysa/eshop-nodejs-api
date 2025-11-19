const mongoose = require("mongoose");

const refreshTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true,
  },
  // Reference relationship: stores the ObjectId of the user from the User model
  // and allows population of full user details using .populate("user")
  user: {
    type: mongoose.Schema.Types.ObjectId,

    ref: "User",
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  revoked: {
    type: Boolean,
    default: false,
  },
  expiresAt: {
    type: Date,
  },
});

const RefreshToken = mongoose.model("RefreshToken", refreshTokenSchema);
module.exports = RefreshToken;
