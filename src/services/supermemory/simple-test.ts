// Simple test to verify Supermemory service configuration
import dotenv from 'dotenv';
dotenv.config();

// Log environment variables for debugging
console.log('Environment Variables:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('NEXT_PUBLIC_SUPERMEMORY_API_URL:', process.env.NEXT_PUBLIC_SUPERMEMORY_API_URL);
console.log(
  'NEXT_PUBLIC_SUPERMEMORY_API_KEY:',
  process.env.NEXT_PUBLIC_SUPERMEMORY_API_KEY
    ? '***' + process.env.NEXT_PUBLIC_SUPERMEMORY_API_KEY.slice(-4)
    : 'Not set',
);

// Simple test to verify the service can be imported
console.log('\nTesting service import...');
try {
  const { supermemoryService } = require('.');
  console.log('✅ Supermemory service imported successfully');

  // Test basic configuration
  console.log('\nService configuration:');
  console.log('- Base URL:', supermemoryService.baseUrl);
  console.log('- API Key configured:', supermemoryService.apiKey ? 'Yes' : 'No');
} catch (error) {
  console.error('❌ Failed to import service:', error);
  process.exit(1);
}

console.log('\nTest completed!');
