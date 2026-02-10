const express = require("express");
const router = express.Router();

const Subscription = require("../models/Subscription");
const generateSubscriptionKey = require("../utils/generateSubscriptionKey");

router.post("/test/create-subscription", async (req, res) => {
    try {
        const subscription = new Subscription({
            subscriptionKey: generateSubscriptionKey(),
            userId: req.body.userId,
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        });

        await subscription.save();
        res.status(201).json(subscription);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;