const fs = require("fs");
const { exec } = require("child_process");
const path = require("path");

module.exports = (code, input, callback) => {
  const timestamp = Date.now();
  const className = `Main${timestamp}`; // class must match filename
  const codePath = path.join(__dirname, "../codes", `${className}.java`);
  const inputPath = path.join(__dirname, "../input", `${className}.in`);
  const classPath = path.join(__dirname, "../output");

  fs.writeFileSync(codePath, code);
  fs.writeFileSync(inputPath, input || "");

  // Compile the Java file
  exec(`javac ${codePath} -d ${classPath}`, (err, stdout, stderr) => {
    if (err || stderr) {
      cleanUp();
      return callback({ error: stderr || err.message });
    }

    // Run the compiled .class file
    exec(`java -cp ${classPath} ${className} < ${inputPath}`, (err, stdout, stderr) => {
      cleanUp();
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
