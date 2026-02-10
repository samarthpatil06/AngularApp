const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

  // Optional (for admin)
  firstName: {
    type: String,
    default: ""
  },

  lastName: {
    type: String,
    default: ""
  },

  phone: {
    type: String,
    default: ""
  },

  // Required
  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  role: {
    type: String,
    enum: ["superadmin", "user"],
    default: "user"
  },

  // Only for normal users
  plan: {
    type: String,
    default: ""
  },

  licenseKey: {
    type: String,
    default: ""
  },

  isActive: {
    type: Boolean,
    default: true
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model("User", userSchema);