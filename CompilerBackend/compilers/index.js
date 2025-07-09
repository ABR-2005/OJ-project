const runCpp = require('./cpp');
const runPython = require('./python');
const runJs = require('./js');

exports.compileCode = (language, code, input, timeLimit, callback) => {
  if (language === "cpp") {
    runCpp(code, input, timeLimit, callback);
  } else if (language === "python") {
    runPython(code, input, timeLimit, callback);
  } else if (language === "javascript") {
    runJs(code, input, timeLimit, callback);
  } else {
    callback({ error: "Unsupported language" });
  }
};