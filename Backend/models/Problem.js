const mongoose = require("mongoose");

const problemSchema = new mongoose.Schema({
  title: String,
  description: String,
  inputFormat: String,
  outputFormat: String,
  sampleInput: String,
  sampleOutput: String,
  testCases: [
    { input: String, 
      expectedOutput: String ,
      isHidden: {type:Boolean,default:false}
    }
  ],
  timeLimit: {type:Number ,default:2000},
  difficulty: String
});

module.exports = mongoose.model("Problem", problemSchema);
