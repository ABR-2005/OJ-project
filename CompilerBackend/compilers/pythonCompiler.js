const fs = require("fs");
const { exec } = require("child_process");
const path = require("path");

module.exports = (code, input, timeLimit, callback) => {
  const timestamp = Date.now();
  const filename = `main_${timestamp}`;
  const codePath = path.join(__dirname, "../codes", `${filename}.py`);
  const inputPath = path.join(__dirname, "../codes", `${filename}.in`);

  fs.writeFileSync(codePath, code);
  fs.writeFileSync(inputPath, input || "");

  exec(`python3 ${codePath} < ${inputPath}`, { timeout: timeLimit || 2000 }, (err, stdout, stderr) => {
    cleanUp();

    if (err && err.killed) return callback({ error: "Time Limit Exceeded" });
    if (err || stderr) return callback({ error: stderr || err.message });

    callback({ output: stdout });
  });

  function cleanUp() {
    fs.unlink(codePath, () => {});
    fs.unlink(inputPath, () => {});
  }
};
