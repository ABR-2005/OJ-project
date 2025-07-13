const Submission = require("../models/Submission");
const User = require("../models/User");

exports.getLeaderboard = async (req,res) => {
    try{
      console.log("[getLeaderboard] called");
      const leaderboard = await Submission.aggregate([
        { $match: { verdict: "Accepted" } },
        { $group: { _id: { userId: "$userId", problemId: "$problemId" } } },
        { $group: { _id: "$_id.userId", uniqueProblems: { $addToSet: "$_id.problemId" } } },
        { $project: { uniqueProblemsSolved: { $size: "$uniqueProblems" } } },
        { $sort: { uniqueProblemsSolved: -1 } },
        { $limit: 10 }
      ]);
      console.log("[getLeaderboard] raw leaderboard:", leaderboard);
      // DEBUG: Log all problemIds for this user
      if (leaderboard.length > 0) {
        const abhyuday = leaderboard.find(e => String(e._id) === '686ef885dd7661d45fa433f3');
        if (abhyuday) {
          console.log('DEBUG: uniqueProblems for Abhyuday Rayala:', abhyuday.uniqueProblems);
        }
      }
      // Populate usernames
      const populated = await Promise.all(
        leaderboard.map(async (entry) => {
          const user = await User.findById(entry._id);
          return {
            userId: entry._id,
            username: user ? user.username : "Unknown",
            uniqueProblemsSolved: entry.uniqueProblemsSolved
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