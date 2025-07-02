const Problem = require("../models/Problem");
const { compileCode } = require("../compilers");

exports.submitCode = async (req, res) => {
  const { code, language, problemId } = req.body;

  try {
    const problem = await Problem.findById(problemId);
    const allCases = [...problem.visibleTestCases, ...problem.hiddenTestCases];

    let allPassed = true;
    for (const test of allCases) {
      const result = await new Promise((resolve) => {
        compileCode(language, code, test.input, (output) => {
          resolve(output);
        });
      });

      if (!result.output || result.output.trim() !== test.output.trim()) {
        allPassed = false;
        break;
      }
    }

    return res.json({
      verdict: allPassed ? "Accepted" : "Wrong Answer"
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
