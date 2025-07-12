const express = require("express");
const { getLeaderboard } = require("../controllers/leaderboardController");
const router = express.Router();

// Make leaderboard public (no verifyToken)
router.get("/", getLeaderboard);

module.exports = router;