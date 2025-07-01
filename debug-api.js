// Debug script for Supermemory API connection
require('dotenv').config();

const https = require('https');
const { URL } = require('url');

// Parse the API URL
const apiUrl = new URL(process.env.NEXT_PUBLIC_SUPERMEMORY_API_URL || 'https://mcp.supermemory.ai');
const API_KEY = process.env.NEXT_PUBLIC_SUPERMEMORY_API_KEY;

console.log('=== Supermemory API Debug ===');
console.log('Environment:');
console.log('- NODE_ENV:', process.env.NODE_ENV);
console.log('- NEXT_PUBLIC_SUPERMEMORY_API_URL:', apiUrl.toString());
console.log('- NEXT_PUBLIC_SUPERMEMORY_API_KEY:', API_KEY ? '***' + API_KEY.slice(-4) : 'Not set');

if (!API_KEY) {
  console.error('❌ Error: NEXT_PUBLIC_SUPERMEMORY_API_KEY is not set in .env');
  process.exit(1);
}

// Test DNS resolution
console.log('\n=== Testing DNS resolution ===');
require('dns').lookup(apiUrl.hostname, (err, address, family) => {
  if (err) {
    console.error('❌ DNS lookup failed:', err);
    return;
  }
  console.log(`✅ Resolved ${apiUrl.hostname} to ${address} (IPv${family})`);
});

// Test TCP connection
console.log('\n=== Testing TCP connection ===');
const socket = require('net').createConnection({
  host: apiUrl.hostname,
  port: 443,
  timeout: 5000,
});

socket.on('connect', () => {
  console.log(`✅ Successfully connected to ${apiUrl.hostname}:443`);
  socket.destroy();
  testHttpsRequest();
});

socket.on('error', (err) => {
  console.error('❌ TCP connection failed:', err);
});

socket.on('timeout', () => {
  console.error('❌ TCP connection timed out');
  socket.destroy();
});

function testHttpsRequest() {
  console.log('\n=== Testing HTTPS request ===');

  const options = {
    hostname: apiUrl.hostname,
    port: 443,
    path: '/api/v1/health',
    method: 'GET',
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      'User-Agent': 'FlorAI-Mobile-Debug/1.0',
      Accept: 'application/json',
    },
    timeout: 10000, // 10 seconds timeout
  };

  console.log('Request options:', {
    method: options.method,
    hostname: options.hostname,
    path: options.path,
    headers: {
      Authorization: 'Bearer ***' + API_KEY.slice(-4),
      'User-Agent': options.headers['User-Agent'],
      Accept: options.headers['Accept'],
    },
  });

  const req = https.request(options, (res) => {
    console.log('\n=== Response ===');
    console.log(`Status: ${res.statusCode} ${res.statusMessage}`);
    console.log('Headers:', res.headers);

    let data = [];
    res.on('data', (chunk) => {
      data.push(chunk);
    });

    res.on('end', () => {
      const responseBody = Buffer.concat(data).toString();
      console.log('\nResponse body:');
      try {
        console.log(JSON.stringify(JSON.parse(responseBody), null, 2));
      } catch (e) {
        console.log(responseBody || '[Empty response]');
      }
    });
  });

  req.on('socket', (socket) => {
    socket.on('secureConnect', () => {
      console.log('\n=== TLS Connection Established ===');
      console.log('Protocol:', socket.getProtocol());
      console.log('Cipher:', socket.getCipher());
      console.log('Authorized:', socket.authorized || 'No');
      if (!socket.authorized) {
        console.log('Authorization Error:', socket.authorizationError);
      }
    });
  });

  req.on('error', (error) => {
    console.error('\n=== Request Error ===');
    console.error('Name:', error.name);
    console.error('Message:', error.message);
    if (error.code) console.error('Code:', error.code);
    if (error.syscall) console.error('Syscall:', error.syscall);
    if (error.hostname) console.error('Hostname:', error.hostname);
    if (error.port) console.error('Port:', error.port);
    if (error.cert) console.error('Certificate:', error.cert);
  });

  req.on('timeout', () => {
    console.error('\n=== Request Timeout ===');
    req.destroy(new Error('Request timeout'));
  });

  req.end();
}

// Add a timeout for the entire script
setTimeout(() => {
  console.log('\n=== Script timeout reached ===');
  process.exit(0);
}, 30000); // 30 seconds total timeout
