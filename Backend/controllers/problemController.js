const Problem= require("../models/Problem");

exports.createProblem = async (req,res) =>{
    try{
      const problem= new Problem(req.body);
      await problem.save();
      res.json({message: "Problem created",problem});
    }
    catch(err){
      res.status(500).json({error: "Error creating problem"});
    }
};

exports.getAllProblems = async(req,res) => {
    const problems = await Problem.find();
    res.json(problems);
};

exports.getProblemBYID= async (req,res) => {
    const problem = await Problem.findById(req.params.id);
    if(!problem) return res.staus(404).json({error: "Problem not found"});
    res.json(problem);
};

exports.updateProblem = async (req,res) => {
    const updated= await Problem.findByIdAndUpdate(req.params.id,req.body,{new: true});
    res.json(updated);
};

exports.deleteProblem =async(req,res) => {
    await Problem.findByIdAndDelete(req.params.id);
    res.json({message: "Deleted successfully"});
}; 