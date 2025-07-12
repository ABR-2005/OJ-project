const fs = require("fs");
const { spawn } = require("child_process");
const path = require("path");

module.exports = function runCpp(code, input, timeLimit, callback) {
  const timestamp = Date.now();
  const codePath = path.join(__dirname, "../codes", `main_${timestamp}.cpp`);
  const inputPath = path.join(__dirname, "../input", `main_${timestamp}.in`);
  const outputPath = path.join(__dirname, "../output", `main_${timestamp}.out`);

  fs.writeFileSync(codePath, code);
  fs.writeFileSync(inputPath, input || "");

  // Compile
  const compile = spawn("g++", [codePath, "-o", outputPath]);
  let compileErr = "";
  compile.stderr.on("data", (data) => (compileErr += data.toString()));
  compile.on("close", (code) => {
    if (code !== 0) {
      cleanUp();
      return callback({ error: compileErr });
    }
    // Run
    const run = spawn(outputPath, [], { stdio: ["pipe", "pipe", "pipe"] });
    let runOut = "";
    let runErr = "";
    run.stdout.on("data", (data) => (runOut += data.toString()));
    run.stderr.on("data", (data) => (runErr += data.toString()));
    run.on("close", (code) => {
      cleanUp();
      if (code !== 0) return callback({ error: runErr });
      return callback({ output: runOut });
    });
    // Provide input
    run.stdin.write(input || "");
    run.stdin.end();
  });

  function cleanUp() {
    fs.unlink(codePath, () => {});
    fs.unlink(inputPath, () => {});
    fs.unlink(outputPath, () => {});
  }
};
