const mongoose =require("mongoose");

const submissionSchema = new mongoose.Schema({
    userId: {type:mongoose.Schema.Types.ObjectId,ref:"User"},
    problemId: {type:mongoose.Schema.Types.ObjectId,ref: "Problem"},
    language: String,
    code: String,
    input: String,
    output: String,
    expectedOutput: String,
    verdict:String,
    submittedAt: {type:Date,default:Date.now}
});

module.exports =mongoose.model("Submission",submissionSchema);