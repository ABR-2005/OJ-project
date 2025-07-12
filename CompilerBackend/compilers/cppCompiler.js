const fs = require("fs");
const { spawn } = require("child_process");
const path = require("path");

module.exports = (code, input, timeLimit, callback) => {
  const timestamp = Date.now();
  const filename = `main_${timestamp}`;
  const codesDir = path.join(__dirname, "../codes");

  // Use short path to avoid spaces issue
  const shortCodesDir = fs.realpathSync(codesDir);
  const codePath = path.join(shortCodesDir, `${filename}.cpp`);
  const inputPath = path.join(shortCodesDir, `${filename}.in`);
  const outputPath = path.join(shortCodesDir, `${filename}.exe`); // Use .exe for Windows

  // Ensure the codes directory exists
  if (!fs.existsSync(shortCodesDir)) {
    fs.mkdirSync(shortCodesDir, { recursive: true });
  }

  // Debug: log paths
  console.log("CPP Compiler Paths:");
  console.log("codePath:", codePath);
  console.log("inputPath:", inputPath);
  console.log("outputPath:", outputPath);

  // Write code and input to files
  fs.writeFileSync(codePath, code);
  fs.writeFileSync(inputPath, input || "");

  // Debug: check file existence
  if (!fs.existsSync(codePath)) {
    return callback({ error: `Code file does not exist: ${codePath}` });
  }
  if (!fs.existsSync(inputPath)) {
    return callback({ error: `Input file does not exist: ${inputPath}` });
  }

  // Compile step
  const compile = spawn("g++", [codePath, "-o", outputPath]);
  let compileErr = "";
  compile.stderr.on("data", (data) => compileErr += data.toString());
  compile.on("close", (code) => {
    if (code !== 0) {
      cleanUp();
      return callback({ error: compileErr });
    }

    // Run step
    const run = spawn(outputPath, [], { stdio: ["pipe", "pipe", "pipe"] });
    let runOut = "";
    let runErr = "";
    run.stdout.on("data", (data) => runOut += data.toString());
    run.stderr.on("data", (data) => runErr += data.toString());
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
