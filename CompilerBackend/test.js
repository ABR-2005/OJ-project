const http = require('http');

const data = JSON.stringify({
  code: `# Write your solution here
# Input two numbers in one line separated by space
a, b = map(int, input().split())

# Print their sum
print(a + b)`,
  input: '5 3',
  language: 'python',
  timeLimit: 5000
});

const options = {
  hostname: 'localhost',
  port: 5001,
  path: '/compile',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, (res) => {
  let responseData = '';
  
  res.on('data', (chunk) => {
    responseData += chunk;
  });
  
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Response:', responseData);
  });
});

req.on('error', (error) => {
  console.error('Error:', error);
});

req.write(data);
req.end(); 