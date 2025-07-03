const Submission = require("../models/Submission");

exports.getLeaderboard = async (req,res) => {
    try{
      const leaderboard = await Submission.aggregate([
        { $match: { verdict: "Accepted" } },
        { $group: { _id: "$userId", solvedCount: { $sum: 1 } } },
        { $sort: { solvedCount: -1 } },
        { $limit: 10 }
      ]);

      res.json(leaderboard);
    }
    catch(err){
      console.error(err);
      res.status(500).json({error:"Leaderboard fetch failed"});
    }
};