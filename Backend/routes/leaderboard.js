const express = require("express");
const router = express.Router();
const {getLeaderboard}=require("../controllers/leaderboardController");

router.get("leaderboard",getLeaderboard); // /api/leaderboard

module.exports = router;