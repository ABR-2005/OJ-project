const runCpp = require('./cppCompiler');
const runPython = require('./pythonCompiler');
const runJs = require('./javaCompiler');

exports.compileCode = (language, code, input, timeLimit, callback) => {
  console.log("🔍 DEBUG: Raw language received:", JSON.stringify(language));
  console.log("🔍 DEBUG: Language type:", typeof language);
  
  const lang = language.toLowerCase();
  console.log(`🔍 Compiler received language: "${language}" -> normalized to: "${lang}"`);
  
  if (lang === "cpp") {
    console.log("🚀 Using C++ compiler");
    runCpp(code, input, timeLimit, callback);
  } else if (lang === "python") {
    console.log("🐍 Using Python compiler");
    runPython(code, input, timeLimit, callback);
  } else if (lang === "java" || lang === "javascript") {
    console.log("☕ Using Java compiler");
    runJs(code, input, timeLimit, callback);
  } else {
    console.log(`❌ Unsupported language: "${lang}"`);
    console.log(`❌ Available options: cpp, python, java, javascript`);
    callback({ error: `Unsupported language: ${lang}. Supported: cpp, python, java` });
  }
};