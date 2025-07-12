const { spawn } = require("child_process");

function testPythonCommand(cmd) {
  return new Promise((resolve) => {
    console.log(`Testing: ${cmd}`);
    const process = spawn(cmd, ['--version'], { stdio: 'pipe' });
    
    let stdout = '';
    let stderr = '';
    
    process.stdout.on('data', (data) => stdout += data.toString());
    process.stderr.on('data', (data) => stderr += data.toString());
    
    process.on('error', (err) => {
      console.log(`❌ ${cmd}: ${err.message}`);
      resolve(false);
    });
    
    process.on('close', (code) => {
      if (code === 0) {
        console.log(`✅ ${cmd}: ${stdout.trim()}`);
        resolve(true);
      } else {
        console.log(`❌ ${cmd}: Exit code ${code}, stderr: ${stderr}`);
        resolve(false);
      }
    });
  });
}

async function testAllPythonCommands() {
  const commands = [
    "python",
    "py", 
    "python3",
    "python3.13",
    "python3.12",
    "python3.11",
    "python3.10",
    "python3.9",
    "python3.8"
  ];
  
  console.log("Testing Python commands...\n");
  
  for (const cmd of commands) {
    const works = await testPythonCommand(cmd);
    if (works) {
      console.log(`\n🎉 Found working Python command: ${cmd}\n`);
      return cmd;
    }
  }
  
  console.log("\n❌ No Python commands found in PATH");
  return null;
}

testAllPythonCommands(); 