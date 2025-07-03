const axios = require("axios");
const Submission = require("../models/Submission");
const Problem = require("../models/Problem");

exports.submitCode = async (req, res) => {
  try {
    const { userId, problemId, code, language } = req.body;

    // 1️⃣ Fetch problem details
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ error: "Problem not found" });
    }

    // 2️⃣ Loop through test cases
    let allPassed = true;
    let finalOutput = "";
    let finalInput = "";
    let error = null;

    for (let test of problem.testCases) {
      const response = await axios.post("http://localhost:5001/compile", {
        code,
        input: test.input,
        language,
      });

      const result = response.data;
      finalInput = test.input;
      finalOutput = result.output || "";
      error = result.error || null;

      if (error || finalOutput.trim() !== test.output.trim()) {
        allPassed = false;
        break;
      }
    }

    const verdict = error
      ? "Compilation Error"
      : allPassed
      ? "Accepted"
      : "Wrong Answer";

    // 3️⃣ Save submission to DB
    const submission = new Submission({
      userId,
      problemId,
      language,
      code,
      input: finalInput,
      output: finalOutput,
      expectedOutput: allPassed ? finalOutput : "Check test cases",
      verdict,
      submittedAt: new Date(),
    });

    await submission.save();

    // 4️⃣ Send response
    res.json({
      verdict,
      output: finalOutput,
      error,
    });
  } catch (err) {
    console.error("Submission Error:", err);
    res.status(500).json({ error: "Server error during code submission" });
  }
};


exports.getUserSubmissions = async(req,res) => {
   try{
     const {userId}=req.params;
     const submissions = await Submission.find({userId}).populate("problemId","title");
     res.json(submissions);
   }

   catch(err){
     console.error(err);
     res.status(500).json({error:"Failed to fetch submissions"});
   }
};