const fs = require("fs");
const { exec } = require("child_process");
const path = require("path");

module.exports = (code, input, timeLimit, callback) => {
  const timestamp = Date.now();
  const filename = `main_${timestamp}`;
  const codePath = path.join(__dirname, "../codes", `${filename}.cpp`);
  const inputPath = path.join(__dirname, "../codes", `${filename}.in`);
  const outputPath = path.join(__dirname, "../codes", `${filename}.out`);

  // Write code and input to files
  fs.writeFileSync(codePath, code);
  fs.writeFileSync(inputPath, input || "");

  // Compile the C++ code
  exec(`g++ ${codePath} -o ${outputPath}`, { timeout: timeLimit || 2000 }, (err, stdout, stderr) => {
    if (err || stderr) {
      cleanUp();
      return callback({ error: stderr || err.message });
    }

    // Run the executable with input redirection
    exec(`${outputPath} < ${inputPath}`, { timeout: timeLimit || 2000 }, (err, stdout, stderr) => {
      cleanUp();

      // Time Limit Exceeded check
      if (err && err.killed) {
        return callback({ error: "Time Limit Exceeded" });
      }

      if (err || stderr) {
        return callback({ error: stderr || err.message });
      }

      callback({ output: stdout });
    });
  });

  // Clean up files after run
  function cleanUp() {
    fs.unlink(codePath, () => {});
    fs.unlink(inputPath, () => {});
    fs.unlink(outputPath, () => {});
  }
};
