const Problem= require("../models/Problem");

exports.createProblem = async (req,res) =>{
    try{
      let problemData = { ...req.body };
      if (typeof problemData.testCases === "string") {
        problemData.testCases = JSON.parse(problemData.testCases);
      }
      const problem= new Problem(problemData);
      await problem.save();
      res.json({message: "Problem created",problem});
    }
    catch(err){
      console.error("Error creating problem:", err);
      res.status(500).json({error: "Error creating problem: " + err.message});
    }
};

exports.getAllProblems = async(req,res) => {
    try {
        const problems = await Problem.find();
        res.json(problems);
    } catch (err) {
        console.error("Get all problems error:", err);
        res.status(500).json({error: "Error fetching problems"});
    }
};

exports.getProblemBYID= async (req,res) => {
    try {
        const problem = await Problem.findById(req.params.id);
        if(!problem) return res.status(404).json({error: "Problem not found"});
        res.json(problem);
    } catch (err) {
        console.error("Get problem by ID error:", err);
        res.status(500).json({error: "Error fetching problem"});
    }
};

exports.updateProblem = async (req,res) => {
    try {
        // Clean the request body - remove _id fields from test cases
        const updateData = { ...req.body };
        
        // Handle testCases - parse from JSON string if needed and clean _id fields
        if (updateData.testCases) {
            let testCasesArray;
            
            // If testCases is a string, parse it
            if (typeof updateData.testCases === 'string') {
                try {
                    testCasesArray = JSON.parse(updateData.testCases);
                } catch (parseError) {
                    return res.status(400).json({error: "Invalid test cases JSON format"});
                }
            } else {
                testCasesArray = updateData.testCases;
            }
            
            // Clean _id fields from test cases
            if (Array.isArray(testCasesArray)) {
                updateData.testCases = testCasesArray.map(testCase => {
                    const { _id, ...cleanTestCase } = testCase;
                    return cleanTestCase;
                });
            }
        }
        
        const updated = await Problem.findByIdAndUpdate(req.params.id, updateData, {new: true});
        if (!updated) {
            return res.status(404).json({error: "Problem not found"});
        }
        res.json(updated);
    } catch (err) {
        console.error("Update problem error:", err);
        res.status(500).json({error: "Error updating problem"});
    }
};

exports.deleteProblem =async(req,res) => {
    try {
        const deleted = await Problem.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({error: "Problem not found"});
        }
        res.json({message: "Deleted successfully"});
    } catch (err) {
        console.error("Delete problem error:", err);
        res.status(500).json({error: "Error deleting problem"});
    }
}; 