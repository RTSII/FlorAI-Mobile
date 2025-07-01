// Simple Deno test script
console.log('🚀 Deno is working!');
console.log(`Deno version: ${Deno.version.deno}`);

// Test web fetch (requires --allow-net)
const response = await fetch('https://api.github.com/zen');
const message = await response.text();
console.log(`Zen message: ${message}`);
