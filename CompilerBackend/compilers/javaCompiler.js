const fs = require("fs");
const { spawn } = require("child_process");
const path = require("path");

module.exports = (code, input, timeLimit, callback) => {
  console.log("🔥 Java compiler called!");
  const timestamp = Date.now();
  const codesDir = path.join(__dirname, "../codes");
  
  // Use short path to avoid spaces issue
  const shortCodesDir = fs.realpathSync(codesDir);
  const inputPath = path.join(shortCodesDir, `input_${timestamp}.in`);
  const classPath = path.join(shortCodesDir, "classes");

  // Ensure directories exist
  if (!fs.existsSync(shortCodesDir)) {
    fs.mkdirSync(shortCodesDir, { recursive: true });
  }
  if (!fs.existsSync(classPath)) {
    fs.mkdirSync(classPath, { recursive: true });
  }

  // Check if code already contains a class declaration
  const hasClassDeclaration = code.includes('public class') || code.includes('class');
  
  let className, fullCode;
  if (hasClassDeclaration) {
    // Extract class name from existing code
    const classMatch = code.match(/public\s+class\s+(\w+)/);
    className = classMatch ? classMatch[1] : `Main${timestamp}`;
    fullCode = code;
  } else {
    // Wrap code in class if no class declaration found
    className = `Main${timestamp}`;
    fullCode = `public class ${className} {\n    public static void main(String[] args) {\n${code}\n    }\n}`;
  }
  const codePath = path.join(shortCodesDir, `${className}.java`);

  console.log("Java Compiler Paths:");
  console.log("className:", className);
  console.log("codePath:", codePath);
  console.log("inputPath:", inputPath);
  console.log("classPath:", classPath);

  console.log("🔍 Final code being written:");
  console.log(fullCode);

  fs.writeFileSync(codePath, fullCode);
  fs.writeFileSync(inputPath, input || "");

  // Debug: check file existence
  if (!fs.existsSync(codePath)) {
    return callback({ error: `Code file does not exist: ${codePath}` });
  }
  if (!fs.existsSync(inputPath)) {
    return callback({ error: `Input file does not exist: ${inputPath}` });
  }

  // Use full paths to Java commands
  const javacPath = "C:\\Program Files\\Common Files\\Oracle\\Java\\javapath\\javac.exe";
  const javaPath = "C:\\Program Files\\Common Files\\Oracle\\Java\\javapath\\java.exe";

  console.log("Using javac path:", javacPath);
  console.log("Using java path:", javaPath);

  // Compile Java code
  const compile = spawn(javacPath, [codePath, "-d", classPath]);
  let compileErr = "";
  compile.stderr.on("data", (data) => compileErr += data.toString());
  
  compile.on("close", (code) => {
    if (code !== 0) {
      cleanUp();
      return callback({ error: compileErr || "Java compilation failed" });
    }

    // Use the actual class name for execution
    const compiledClassPath = path.join(classPath, `${className}.class`);
    if (!fs.existsSync(compiledClassPath)) {
      cleanUp();
      return callback({ error: `Compiled class not found: ${compiledClassPath}` });
    }

    // Run Java class with the actual class name
    const run = spawn(javaPath, ["-cp", classPath, className], { stdio: ["pipe", "pipe", "pipe"] });
    let runOut = "";
    let runErr = "";
    
    run.stdout.on("data", (data) => runOut += data.toString());
    run.stderr.on("data", (data) => runErr += data.toString());
    
    run.on("close", (code) => {
      cleanUp();
      if (code !== 0) return callback({ error: runErr || "Java execution failed" });
      return callback({ output: runOut });
    });
    
    // Provide input
    run.stdin.write(input || "");
    run.stdin.end();
  });

  function cleanUp() {
    try {
      if (fs.existsSync(codePath)) {
        fs.unlinkSync(codePath);
      }
      if (fs.existsSync(inputPath)) {
        fs.unlinkSync(inputPath);
      }
      // Remove all .class files in classPath
      const files = fs.readdirSync(classPath);
      for (const file of files) {
        if (file.endsWith('.class')) {
          fs.unlinkSync(path.join(classPath, file));
        }
      }
    } catch (err) {
      console.error("Java cleanup error:", err);
    }
  }
};
