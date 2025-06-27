const mongoose = require("mongoose");

const problemSchema = new mongoose.Schema({
  title: String,
  description: String,
  inputFormat: String,
  outputFormat: String,
  sampleInput: String,
  sampleOutput: String,
  testCases: [
    { input: String, expectedOutput: String }
  ],
  difficulty: String
});

module.exports = mongoose.model("Problem", problemSchema);
