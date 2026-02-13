const express = require("express");
const router = express.Router();
const { getDashboardSummary } = require("../services/dashboard.service");

router.get("/summary", async (req, res) => {
    try {
        const summary = await getDashboardSummary();
        res.status(200).json(summary);
    } catch (error) {
        res.status(500).json({
            message: "Failed to load dashboard summary",
            error: error.message,
        });
    }
});

module.exports = router;