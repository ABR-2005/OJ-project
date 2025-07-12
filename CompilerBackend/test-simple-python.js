const { spawn } = require("child_process");

console.log("Testing simple Python execution...");

// Test 1: Just python --version
const pythonProcess = spawn("python", ["--version"], { stdio: "pipe" });

pythonProcess.stdout.on("data", (data) => {
  console.log("✅ Python version:", data.toString().trim());
});

pythonProcess.stderr.on("data", (data) => {
  console.log("❌ Python stderr:", data.toString().trim());
});

pythonProcess.on("error", (err) => {
  console.log("❌ Python spawn error:", err.message);
});

pythonProcess.on("close", (code) => {
  console.log("Python process closed with code:", code);
  
  // Test 2: Try to run a simple Python script
  console.log("\nTesting simple Python script...");
  
  const testProcess = spawn("python", ["-c", "print('Hello from Python')"], { stdio: "pipe" });
  
  testProcess.stdout.on("data", (data) => {
    console.log("✅ Python output:", data.toString().trim());
  });
  
  testProcess.stderr.on("data", (data) => {
    console.log("❌ Python stderr:", data.toString().trim());
  });
  
  testProcess.on("error", (err) => {
    console.log("❌ Python script error:", err.message);
  });
  
  testProcess.on("close", (code) => {
    console.log("Python script closed with code:", code);
  });
}); 