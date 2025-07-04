const fs = require("fs");
const { exec } = require("child_process");
const path = require("path");

module.exports = (code, input, timeLimit, callback) => {
  const timestamp = Date.now();
  const className = `Main${timestamp}`;
  const codePath = path.join(__dirname, "../codes", `${className}.java`);
  const inputPath = path.join(__dirname, "../input", `${className}.in`);
  const classPath = path.join(__dirname, "../output");

  // Wrap code inside public class
  const fullCode = `public class ${className} {\n${code}\n}`;

  fs.writeFileSync(codePath, fullCode);
  fs.writeFileSync(inputPath, input || "");

  // Compile Java code
  exec(`javac ${codePath} -d ${classPath}`, { timeout: timeLimit || 2000 }, (err, stdout, stderr) => {
    if (err || stderr) {
      cleanUp();
      return callback({ error: stderr || err.message });
    }

    // Run Java class
    exec(`java -cp ${classPath} ${className} < ${inputPath}`, { timeout: timeLimit || 2000 }, (err, stdout, stderr) => {
      cleanUp();

      if (err && err.killed) return callback({ error: "Time Limit Exceeded" });
      if (err || stderr) return callback({ error: stderr || err.message });

      return callback({ output: stdout });
    });
  });

  function cleanUp() {
    fs.unlink(codePath, () => {});
    fs.unlink(inputPath, () => {});
    fs.unlink(path.join(classPath, `${className}.class`), () => {});
  }
};
