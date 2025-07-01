// Simple test script to verify Supermemory API connection
require('dotenv').config();

const https = require('https');

const API_URL = process.env.NEXT_PUBLIC_SUPERMEMORY_API_URL || 'https://mcp.supermemory.ai';
const API_KEY = process.env.NEXT_PUBLIC_SUPERMEMORY_API_KEY;

console.log('Testing Supermemory API connection...');
console.log('API URL:', API_URL);
console.log('API Key:', API_KEY ? '***' + API_KEY.slice(-4) : 'Not set');

if (!API_KEY) {
  console.error('❌ Error: NEXT_PUBLIC_SUPERMEMORY_API_KEY is not set in .env');
  process.exit(1);
}

const options = {
  hostname: 'mcp.supermemory.ai',
  port: 443,
  path: '/api/v1/health',
  method: 'GET',
  headers: {
    Authorization: `Bearer ${API_KEY}`,
    'Content-Type': 'application/json',
  },
};

console.log('\nSending request to:', `https://${options.hostname}${options.path}`);

const req = https.request(options, (res) => {
  console.log('\nResponse status code:', res.statusCode);
  console.log('Response headers:', res.headers);

  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      console.log('Response data:', json);
    } catch (e) {
      console.log('Response data (not JSON):', data);
    }
    console.log('\n✅ Request completed');
  });
});

req.on('error', (error) => {
  console.error('❌ Request error:');
  console.error(error);
});

req.end();
