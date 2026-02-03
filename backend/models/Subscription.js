const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema(
  {
    subscriptionKey: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: v => v.length === 16,
        message: "Subscription key must be exactly 16 characters",
      },
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    planType: {
      type: String,
      enum: ["free", "trial", "premium"],
      default: "trial",
    },

    status: {
      type: String,
      enum: ["active", "expired", "revoked"],
      default: "active",
    },

    startDate: {
      type: Date,
      required: true,
      default: Date.now,
    },

    endDate: {
      type: Date,
      required: true,
    },

    revokedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Subscription", subscriptionSchema);
