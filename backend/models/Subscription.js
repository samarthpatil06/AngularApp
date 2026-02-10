// Subscription model for managing user subscriptions in the database.

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

        planType: {
            type: String,
            enum: ["free", "trial", "premium"],
            required: true,
        },

        status: {
            type: String,
            enum: ["inactive", "active", "expired", "revoked"],
            default: "inactive",
        },

        startDate: {
            type: Date,
            default: null,
        },

        endDate: {
            type: Date,
            default: null,
        },

        activatedAt: {
            type: Date,
            default: null,
        },

        revokedAt: {
            type: Date,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Subscription", subscriptionSchema);