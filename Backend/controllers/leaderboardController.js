const Submission = require("../models/Submission");
const User = require("../models/User");

exports.getLeaderboard = async (req,res) => {
    try{
      console.log("[getLeaderboard] called");
      const leaderboard = await Submission.aggregate([
        { $match: { verdict: "Accepted" } },
        { $group: { _id: "$userId", acceptedCount: { $sum: 1 } } },
        { $sort: { acceptedCount: -1 } },
        { $limit: 10 }
      ]);
      console.log("[getLeaderboard] raw leaderboard:", leaderboard);
      // Populate usernames
      const populated = await Promise.all(
        leaderboard.map(async (entry) => {
          const user = await User.findById(entry._id);
          return {
            userId: entry._id,
            username: user ? user.username : "Unknown",
            acceptedCount: entry.acceptedCount
          };
        })
      );
      console.log("[getLeaderboard] populated leaderboard:", populated);
      res.json(populated);
    }
    catch(err){
      console.error(err);
      res.status(500).json({error:"Leaderboard fetch failed"});
    }
};