const { execSync, spawn } = require('child_process');
const fs = require('fs');

console.log("=== Python Installation Diagnostic ===\n");

// 1. Check if python is in PATH
console.log("1. Checking Python in PATH:");
try {
  const pythonPath = execSync("where python", { encoding: 'utf8' }).trim();
  console.log("✅ Python found in PATH:", pythonPath);
} catch (err) {
  console.log("❌ Python not found in PATH");
}

// 2. Check if py launcher is available
console.log("\n2. Checking py launcher:");
try {
  const pyPath = execSync("where py", { encoding: 'utf8' }).trim();
  console.log("✅ py launcher found:", pyPath);
} catch (err) {
  console.log("❌ py launcher not found");
}

// 3. Check Python version
console.log("\n3. Checking Python version:");
try {
  const version = execSync("python --version", { encoding: 'utf8' }).trim();
  console.log("✅ Python version:", version);
} catch (err) {
  console.log("❌ Cannot get Python version:", err.message);
}

// 4. Check py launcher version
console.log("\n4. Checking py launcher version:");
try {
  const pyVersion = execSync("py --version", { encoding: 'utf8' }).trim();
  console.log("✅ py launcher version:", pyVersion);
} catch (err) {
  console.log("❌ Cannot get py launcher version:", err.message);
}

// 5. Check file associations
console.log("\n5. Checking .py file associations:");
try {
  const assoc = execSync('assoc .py', { encoding: 'utf8' }).trim();
  console.log("✅ .py file association:", assoc);
} catch (err) {
  console.log("❌ Cannot check .py file association:", err.message);
}

// 6. Test direct Python execution
console.log("\n6. Testing direct Python execution:");
try {
  const testProcess = spawn("python", ["-c", "print('Hello from Python')"], { stdio: 'pipe' });
  let output = '';
  testProcess.stdout.on('data', (data) => output += data.toString());
  testProcess.on('close', (code) => {
    if (code === 0) {
      console.log("✅ Direct Python execution works:", output.trim());
    } else {
      console.log("❌ Direct Python execution failed with code:", code);
    }
  });
} catch (err) {
  console.log("❌ Cannot spawn Python process:", err.message);
}

// 7. Test py launcher execution
console.log("\n7. Testing py launcher execution:");
try {
  const pyProcess = spawn("py", ["-c", "print('Hello from py launcher')"], { stdio: 'pipe' });
  let pyOutput = '';
  pyProcess.stdout.on('data', (data) => pyOutput += data.toString());
  pyProcess.on('close', (code) => {
    if (code === 0) {
      console.log("✅ py launcher execution works:", pyOutput.trim());
    } else {
      console.log("❌ py launcher execution failed with code:", code);
    }
  });
} catch (err) {
  console.log("❌ Cannot spawn py launcher process:", err.message);
}

// 8. Check common Python installation paths
console.log("\n8. Checking common Python installation paths:");
const commonPaths = [
  "C:\\Python39\\python.exe",
  "C:\\Python310\\python.exe", 
  "C:\\Python311\\python.exe",
  "C:\\Python312\\python.exe",
  "C:\\Python313\\python.exe",
  "C:\\Users\\ASUS\\AppData\\Local\\Programs\\Python\\Python39\\python.exe",
  "C:\\Users\\ASUS\\AppData\\Local\\Programs\\Python\\Python310\\python.exe",
  "C:\\Users\\ASUS\\AppData\\Local\\Programs\\Python\\Python311\\python.exe",
  "C:\\Users\\ASUS\\AppData\\Local\\Programs\\Python\\Python312\\python.exe",
  "C:\\Users\\ASUS\\AppData\\Local\\Programs\\Python\\Python313\\python.exe"
];

commonPaths.forEach(pythonPath => {
  if (fs.existsSync(pythonPath)) {
    console.log(`✅ Found: ${pythonPath}`);
  }
});

console.log("\n=== Diagnostic Complete ==="); 