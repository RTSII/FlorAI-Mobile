// Direct test of Supermemory API connection
import dotenv from 'dotenv';
dotenv.config();

const API_URL = process.env.NEXT_PUBLIC_SUPERMEMORY_API_URL || 'https://mcp.supermemory.ai';
const API_KEY = process.env.NEXT_PUBLIC_SUPERMEMORY_API_KEY;

console.log('Testing Supermemory API connection...');
console.log('API URL:', API_URL);
console.log('API Key:', API_KEY ? '***' + API_KEY.slice(-4) : 'Not set');

if (!API_KEY) {
  console.error('❌ Error: NEXT_PUBLIC_SUPERMEMORY_API_KEY is not set in .env');
  process.exit(1);
}

async function testConnection() {
  try {
    console.log('\nSending test request...');
    const response = await fetch(`${API_URL}/api/v1/health`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    const responseText = await response.text();
    console.log('Response status:', response.status, response.statusText);

    try {
      const data = JSON.parse(responseText);
      console.log('Response data:', data);
    } catch (e) {
      console.log('Response text (not JSON):', responseText);
    }

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    console.log('✅ Successfully connected to Supermemory API');
  } catch (error) {
    console.error('❌ Error connecting to Supermemory API:');
    if (error instanceof Error) {
      console.error('- Name:', error.name);
      console.error('- Message:', error.message);
      if ('code' in error) console.error('- Code:', error.code);
      if ('syscall' in error) console.error('- Syscall:', error.syscall);
      if ('address' in error) console.error('- Address:', error.address);
      if ('port' in error) console.error('- Port:', error.port);
      console.error('- Stack:', error.stack);
    } else {
      console.error('-', error);
    }
  }
}

testConnection();
