const fs = require("fs");
const { spawn } = require("child_process");
const path = require("path");

module.exports = (code, input, timeLimit, callback) => {
  console.log("🐍 Python compiler called!");
  const timestamp = Date.now();
  const codesDir = path.join(__dirname, "../codes");
  const shortCodesDir = fs.realpathSync(codesDir);
  const codePath = path.join(shortCodesDir, `main_${timestamp}.py`);
  const inputPath = path.join(shortCodesDir, `main_${timestamp}.in`);

  if (!fs.existsSync(shortCodesDir)) {
    fs.mkdirSync(shortCodesDir, { recursive: true });
  }

  fs.writeFileSync(codePath, code);
  fs.writeFileSync(inputPath, input || "");

  // Use the full path to python
  const pythonPath = "python3";
  console.log("Using python path:", pythonPath);
  console.log("Python file:", codePath);

  const pythonProcess = spawn(pythonPath, [codePath], { stdio: ["pipe", "pipe", "pipe"] });

  let stdout = "";
  let stderr = "";
  let processKilled = false;

  const timeout = setTimeout(() => {
    if (!processKilled) {
      processKilled = true;
      pythonProcess.kill('SIGKILL');
      cleanUp();
      return callback({ error: "Time limit exceeded" });
    }
  }, timeLimit || 5000);

  pythonProcess.stdout.on("data", (data) => { stdout += data.toString(); });
  pythonProcess.stderr.on("data", (data) => { stderr += data.toString(); });

  pythonProcess.on("error", (err) => {
    clearTimeout(timeout);
    if (!processKilled) {
      processKilled = true;
      cleanUp();
      return callback({ error: `Python execution failed: ${err.message}` });
    }
  });

  pythonProcess.on("close", (code) => {
    clearTimeout(timeout);
    if (!processKilled) {
      processKilled = true;
      cleanUp();
      if (code === 0) {
        return callback({ output: stdout });
      } else {
        return callback({ error: stderr || "Python execution error" });
      }
    }
  });

  pythonProcess.stdin.write(input || "");
  pythonProcess.stdin.end();

  function cleanUp() {
    try {
      if (fs.existsSync(codePath)) fs.unlinkSync(codePath);
      if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
    } catch (err) {
      console.error("Python cleanup error:", err);
    }
  }
};
