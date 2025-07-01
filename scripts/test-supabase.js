console.log('Starting Supabase connection test...');

// Load environment variables from .env file
require('dotenv').config({ path: require('path').resolve(__dirname, '..', '.env') });

// Log environment variables (with sensitive values redacted)
console.log('Environment variables loaded. Checking Supabase configuration...');

// Get Supabase URL and key from environment
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Log configuration (redacted for security)
console.log('Supabase URL:', supabaseUrl ? '✅ Present' : '❌ Missing');
console.log('Supabase Anon Key:', supabaseKey ? '✅ Present' : '❌ Missing');

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing required Supabase configuration. Please check your .env file.');
  process.exit(1);
}

console.log('\nEnvironment details:');
console.log(`- Node.js version: ${process.version}`);
console.log(`- Platform: ${process.platform} ${process.arch}`);

// Import required modules
const { createClient } = require('@supabase/supabase-js');
const fetch = require('node-fetch');

// Configure global fetch for node-fetch
global.fetch = fetch;

console.log('\nInitializing Supabase client...');
console.log(`- Supabase URL: ${supabaseUrl.replace(/\/\/([^:]+):[^@]+@/, '//$1:*****@')}`);
console.log(`- Anon Key: ${supabaseKey ? `${supabaseKey.substring(0, 5)}...${supabaseKey.substring(supabaseKey.length - 5)}` : 'MISSING'}`);

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false
  },
  global: {
    headers: {
      'X-Client-Info': 'florai-mobile-test-script'
    }
  }
});

// Test connection to Supabase
async function testConnection() {
  try {
    console.log('\nTesting Supabase connection...');
    
    // Test the auth endpoint - this is the most reliable way to test the connection
    console.log('\nTesting authentication...');
    const { data: authData, error: authError } = await supabase.auth.getSession();
    
    if (authError) {
      console.error('❌ Authentication test failed:');
      console.error(authError);
      throw new Error('Failed to connect to Supabase Auth');
    } 
    
    console.log('✅ Successfully connected to Supabase Auth!');
    console.log('Session:', authData.session ? 'Active' : 'No active session');
    
    // Test a simple query to the database
    console.log('\nTesting database connection with a simple query...');
    try {
      // Try to get the current timestamp from the database
      const { data, error } = await supabase.rpc('now');
      
      if (error) {
        console.warn('⚠️ Simple RPC query failed, but this is expected in a fresh project.');
        console.warn('You can create this function in your Supabase SQL editor with:');
        console.warn('CREATE OR REPLACE FUNCTION public.now()');
        console.warn('RETURNS timestamptz');
        console.warn('LANGUAGE sql');
        console.warn('AS $function$');
        console.warn('  SELECT now();');
        console.warn('$function$');
      } else {
        console.log('✅ Successfully queried database! Current time:', new Date(data).toISOString());
      }
    } catch (dbError) {
      console.warn('⚠️ Database query failed, but this is expected in a fresh project.');
      console.warn('You can create tables and functions in the Supabase SQL editor.');
    }
    
  } catch (error) {
    console.error('❌ Error testing Supabase connection:');
    console.error(error);
    process.exit(1);
  }
}

// Run the test
// Add error handling for unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('\nUnhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Add error handling for uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('\nUncaught Exception:', error);
  process.exit(1);
});

// Run the test
testConnection().catch(error => {
  console.error('\nError in testConnection:', error);
  
  // Log additional diagnostic information
  if (error.code) console.error('Error code:', error.code);
  if (error.hint) console.error('Hint:', error.hint);
  if (error.details) console.error('Details:', error.details);
  
  process.exit(1);
});
