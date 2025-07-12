const { spawn } = require('child_process');

console.log("=== Java Installation Test ===\n");

// Test 1: Check if javac is available
console.log("1. Testing javac (Java compiler):");
const javacProcess = spawn("javac", ["-version"], { stdio: "pipe" });

javacProcess.stdout.on("data", (data) => {
  console.log("✅ javac version:", data.toString().trim());
});

javacProcess.stderr.on("data", (data) => {
  console.log("✅ javac version (stderr):", data.toString().trim());
});

javacProcess.on("error", (err) => {
  console.log("❌ javac not found:", err.message);
});

javacProcess.on("close", (code) => {
  console.log("javac process closed with code:", code);
  
  // Test 2: Check if java is available
  console.log("\n2. Testing java (Java runtime):");
  const javaProcess = spawn("java", ["-version"], { stdio: "pipe" });
  
  javaProcess.stdout.on("data", (data) => {
    console.log("✅ java version:", data.toString().trim());
  });
  
  javaProcess.stderr.on("data", (data) => {
    console.log("✅ java version (stderr):", data.toString().trim());
  });
  
  javaProcess.on("error", (err) => {
    console.log("❌ java not found:", err.message);
  });
  
  javaProcess.on("close", (code) => {
    console.log("java process closed with code:", code);
    
    // Test 3: Try to compile and run a simple Java program
    console.log("\n3. Testing simple Java compilation and execution:");
    const fs = require('fs');
    const path = require('path');
    
    const testCode = `
public class TestJava {
    public static void main(String[] args) {
        System.out.println("Hello from Java!");
    }
}`;
    
    const testFile = path.join(__dirname, "TestJava.java");
    fs.writeFileSync(testFile, testCode);
    
    console.log("Created test file:", testFile);
    
    // Compile
    const compileTest = spawn("javac", [testFile]);
    compileTest.on("close", (compileCode) => {
      if (compileCode === 0) {
        console.log("✅ Java compilation successful");
        
        // Run
        const runTest = spawn("java", ["-cp", __dirname, "TestJava"]);
        runTest.stdout.on("data", (data) => {
          console.log("✅ Java execution successful:", data.toString().trim());
        });
        runTest.stderr.on("data", (data) => {
          console.log("❌ Java execution error:", data.toString().trim());
        });
        runTest.on("close", (runCode) => {
          console.log("Java test execution closed with code:", runCode);
          
          // Cleanup
          try {
            fs.unlinkSync(testFile);
            fs.unlinkSync(path.join(__dirname, "TestJava.class"));
          } catch (err) {
            console.log("Cleanup error:", err.message);
          }
        });
      } else {
        console.log("❌ Java compilation failed");
      }
    });
  });
}); 