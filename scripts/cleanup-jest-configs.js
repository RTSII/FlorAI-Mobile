const fs = require('fs');
const path = require('path');

// List of legacy Jest config files to remove
const legacyConfigs = [
  'jest.preset-minimal-setup.config.js',
  'jest.preset-gesture-handler.config.js',
  'jest.preset-custom-setup.config.js',
  'jest.preset-both-setups.config.js',
  'jest.incremental.config.js',
  'jest.final.config.js',
  'jest.debug.config.js',
  'jest.preset-transform-ignore.config.js',
  'jest.preset-setup-files.config.js',
  'jest.preset-only.config.js',
  'jest.preset-transform.config.js',
  'jest.simple.config.js',
  'jest.debug.js',
  'jest.setup.js', // Old setup file, we're using jest.setup.minimal.js now
];

console.log('Cleaning up legacy Jest configuration files...');

let removedCount = 0;
let errorCount = 0;

legacyConfigs.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  
  if (fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
      console.log(`✓ Removed: ${file}`);
      removedCount++;
    } catch (error) {
      console.error(`✗ Error removing ${file}:`, error.message);
      errorCount++;
    }
  } else {
    console.log(`- Skipped (not found): ${file}`);
  }
});

// Update package.json scripts
const packageJsonPath = path.join(process.cwd(), 'package.json');

if (fs.existsSync(packageJsonPath)) {
  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    // Update test scripts to use the main jest.config.js
    if (packageJson.scripts) {
      let updated = false;
      
      if (packageJson.scripts.test && packageJson.scripts.test.includes('--config')) {
        packageJson.scripts.test = 'jest';
        updated = true;
      }
      
      if (packageJson.scripts['test:watch'] && packageJson.scripts['test:watch'].includes('--config')) {
        packageJson.scripts['test:watch'] = 'jest --watch';
        updated = true;
      }
      
      if (packageJson.scripts['test:coverage'] && packageJson.scripts['test:coverage'].includes('--config')) {
        packageJson.scripts['test:coverage'] = 'jest --coverage';
        updated = true;
      }
      
      if (updated) {
        fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
        console.log('✓ Updated package.json scripts to use default Jest config');
      }
    }
  } catch (error) {
    console.error('Error updating package.json:', error.message);
    errorCount++;
  }
}

console.log('\nCleanup summary:');
console.log(`- Removed ${removedCount} legacy configuration files`);
console.log(`- ${errorCount} errors occurred during cleanup`);
console.log('\n✅ Jest configuration cleanup complete!');
console.log('The project now uses a single, consolidated jest.config.js file.');

if (errorCount > 0) {
  process.exit(1);
}
