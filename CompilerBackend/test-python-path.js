const { execSync } = require('child_process');

const pythonPaths = [
  "python",
  "py",
  "C:\\Users\\ASUS\\AppData\\Local\\Programs\\Python\\Python313\\python.exe",
  "C:\\Users\\ASUS\\AppData\\Local\\Programs\\Python\\Python312\\python.exe",
  "C:\\Users\\ASUS\\AppData\\Local\\Programs\\Python\\Python311\\python.exe",
  "C:\\Users\\ASUS\\AppData\\Local\\Programs\\Python\\Python310\\python.exe",
  "C:\\Users\\ASUS\\AppData\\Local\\Programs\\Python\\Python39\\python.exe",
  "C:\\Users\\ASUS\\AppData\\Local\\Programs\\Python\\Python38\\python.exe"
];

console.log("Testing Python paths...\n");

for (const pythonPath of pythonPaths) {
  try {
    const result = execSync(`"${pythonPath}" --version`, { encoding: 'utf8' });
    console.log(`✅ ${pythonPath}: ${result.trim()}`);
    console.log(`🎉 Use this path: ${pythonPath}\n`);
    break;
  } catch (error) {
    console.log(`❌ ${pythonPath}: ${error.message}`);
  }
} 