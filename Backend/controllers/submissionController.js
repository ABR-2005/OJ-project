const axios = require("axios");
const Submission = require("../models/Submission");
const Problem = require("../models/Problem");

exports.submitCode = async (req, res) => {
  
  try { 
    const { userId, problemId, code, language } = req.body;
    // Fetch problem details
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ error: "Problem not found" });
    }
    
    // Loop through test cases
    let allPassed = true;
    let finalInput = "";
    let finalOutput = "";
    let error = null;
    let verdict = "Accepted";

    let baseTimeLimit = problem.timeLimit || 2000;
    let timeLimit = baseTimeLimit;

    if (language === "Java") {
      timeLimit *= 2;
    }   
    else if (language === "Python") {
      timeLimit *= 3;
    }

    for (let test of problem.testCases) {
     const response = await axios.post("http://localhost:5001/compile", {
     code,
     input: test.input,
     language,
     timeLimit
    });

    const result = response.data;
    finalInput = test.input;
    finalOutput = result.output || "";
    error = result.error || null;

    if (error || finalOutput.trim() !== test.expectedOutput.trim()) {
     allPassed = false;
     verdict = test.isHidden ? "Hidden Wrong Answer" : "Wrong Answer";
     break;
   }
  }

// Update verdict in case of compilation error (outside loop)
   if (error) {
    verdict = "Compilation Error";
   }


    // Save submission to DB
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

    // Send response
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