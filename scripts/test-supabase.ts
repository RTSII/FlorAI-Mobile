console.log('Starting Supabase connection test...');

// Use CommonJS requires for better compatibility with ts-node
const dotenv = require('dotenv');
const { createClient } = require('@supabase/supabase-js');
const AsyncStorage = require('@react-native-async-storage/async-storage');
const path = require('path');
const fs = require('fs');

// Load environment variables from .env file
const envPath = path.resolve(__dirname, '..', '.env');
console.log('Looking for .env file at:', envPath);

let envVars = {};

if (fs.existsSync(envPath)) {
  console.log('.env file found, loading variables...');
  const envFileContent = fs.readFileSync(envPath, 'utf-8');
  console.log('.env file content (sensitive values redacted):', 
    envFileContent
      .split('\n')
      .map(line => {
        if (line.includes('=') && !line.trim().startsWith('#')) {
          const [key] = line.split('=');
          return `${key}=[REDACTED]`;
        }
        return line;
      })
      .join('\n')
  );
  
  envVars = dotenv.parse(envFileContent);
  dotenv.config({ path: envPath });
} else {
  console.warn('❌ .env file not found at:', envPath);
}

// Define the shape of our environment variables
interface EnvVars {
  NEXT_PUBLIC_SUPABASE_URL?: string;
  NEXT_PUBLIC_SUPABASE_ANON_KEY?: string;
  [key: string]: string | undefined;
}

// Combine environment variables with proper typing
const env: EnvVars = {
  ...process.env as NodeJS.ProcessEnv,
  ...envVars as EnvVars
};

console.log('Environment variables loaded. Checking Supabase configuration...');

// Get environment variables
const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create a new Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

async function testSupabaseConnection() {
  console.log('\n🔍 Testing Supabase connection...');
  
  // Check if environment variables are set
  console.log('Checking environment variables...');
  console.log('Supabase URL present:', !!supabaseUrl);
  console.log('Supabase Anon Key present:', !!supabaseAnonKey);
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Error: Supabase URL or Anon Key not found in environment variables');
    console.log('\nPlease ensure you have set up your .env file with the following:');
    console.log('NEXT_PUBLIC_SUPABASE_URL=your-supabase-url');
    console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key');
    console.log('\nCurrent working directory:', process.cwd());
    console.log('Environment variables from process.env:', Object.keys(process.env).filter(k => k.includes('SUPABASE')));
    return;
  }

  try {
    console.log('Supabase URL:', supabaseUrl);
    console.log('Supabase Anon Key:', supabaseAnonKey ? '*** (hidden for security)' : 'Not found');
    
    // Test connection by fetching server time
    const { data, error } = await supabase.rpc('now');
    
    if (error) {
      console.error('❌ Error connecting to Supabase:');
      console.error(error);
      return;
    }
    
    console.log('✅ Successfully connected to Supabase!');
    console.log('Server time:', data);
    
    // Test authentication by signing in anonymously
    console.log('\nTesting anonymous authentication...');
    const { data: authData, error: authError } = await supabase.auth.signInAnonymously();
    
    if (authError) {
      console.warn('⚠️ Anonymous auth failed (this might be expected if anonymous auth is not enabled):');
      console.warn(authError);
    } else {
      console.log('✅ Successfully authenticated anonymously!');
      console.log('User ID:', authData.user?.id);
    }
    
  } catch (error) {
    console.error('❌ An unexpected error occurred:');
    console.error(error);
  }
}

// Run the test
testSupabaseConnection()
  .then(() => {
    console.log('\nTest completed.');
  })
  .catch((error) => {
    console.error('Test failed with error:');
    console.error(error);
  });
