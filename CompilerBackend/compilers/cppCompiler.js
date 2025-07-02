const fs = require("fs");
const {exec} = require("child_process");
const path = require("path");

module.exports = (code,input,callback) =>{
    const filename=`main_${Date.now()}.cpp`;
    const filepath = path.join(__dirname,"../temp",filename);
    fs.writeFileSync(filepath,code);
    const outputFile = filepath.replace(".cpp",".out");
    const inputFile =filepath.replace(".cpp",".in");
    fs.writeFileSync(inputFile,input || "");
    // Compile the code
    exec(`g++ ${filepath} -o ${outputFile}`, (err, stdout, stderr) => {
    if (err || stderr) {
      callback({ error: stderr || err.message });
      return;
     }
    // Execute with input
    exec(`${outputFile} < ${inputFile}`, (err, stdout, stderr) => {
      if (err || stderr) {
        callback({ error: stderr || err.message });
        return;
      }
      callback({ output: stdout });
      });
    });
  };
