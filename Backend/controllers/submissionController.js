const axios = require("axios");
const Submission = require("../models/Submission");
const Problem = require("../models/Problem");

exports.submitCode = async (req, res) => {
  try { 
    const { userId, problemId, code, language } = req.body;
    console.log("[submitCode] userId:", userId, "problemId:", problemId, "language:", language);
    // Fetch problem details
    const problem = await Problem.findById(problemId);
    if (!problem) {
      console.log("[submitCode] Problem not found");
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

    if (language.toLowerCase() === "java") {
      timeLimit *= 2;
    }   
    else if (language.toLowerCase() === "python") {
      timeLimit *= 3;
    }

    for (let test of problem.testCases) {
      try {
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
      } catch (compileErr) {
        console.error("Compiler backend error:", compileErr?.response?.data || compileErr.message || compileErr);
        error = compileErr?.response?.data?.error || compileErr.message || "Unknown compiler error";
        verdict = "Compilation Error";
        allPassed = false;
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
    console.log("[submitCode] Submission saved:", submission._id);

    // Send response
    res.json({
      verdict,
      output: finalOutput,
      error,
    });
  } catch (err) {
    console.error("Submission Error:", err);
    res.status(500).json({ error: err.message || "Server error during code submission" });
  }
};

exports.getUserSubmissions = async(req,res) => {
  try{
    const {userId}=req.params;
    console.log("[getUserSubmissions] userId:", userId);
    const submissions = await Submission.find({userId}).populate("problemId","title");
    console.log("[getUserSubmissions] submissions count:", submissions.length);
    res.json(submissions);
  }
  catch(err){
    console.error(err);
    res.status(500).json({error:"Failed to fetch submissions"});
  }
};