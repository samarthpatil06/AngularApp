const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      default: ''
    },

    lastName: {
      type: String,
      default: ''
    },

    email: {
      type: String,
      required: true,
      unique: true
    },

    phone: {
      type: String,
      default: ''
    },

    password: {
      type: String,
      required: true
    },

    role: {
      type: String,
      enum: ['SuperAdmin', 'Admin', 'User'],
      default: 'User'
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
