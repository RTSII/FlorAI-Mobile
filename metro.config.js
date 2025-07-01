const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

// Get the default Metro config
module.exports = (() => {
  const config = getDefaultConfig(__dirname);

  // Add support for resolving custom paths
  config.resolver.extraNodeModules = new Proxy(
    {},
    {
      get: (target, name) => {
        if (typeof name !== 'string') return null;
        // Redirect all paths starting with @/ to src/
        if (name.startsWith('@/')) {
          const targetPath = path.join(__dirname, 'src', name.slice(2));
          return targetPath;
        }
        // Fall back to the standard node module resolution
        return path.join(process.cwd(), `node_modules/${name}`);
      },
    }
  );

  // Add asset extensions
  config.resolver.assetExts = [...config.resolver.assetExts, 'png', 'jpg', 'jpeg', 'gif', 'svg'];
  
  // Add source extensions
  config.resolver.sourceExts = [...config.resolver.sourceExts, 'ts', 'tsx', 'js', 'jsx', 'json'];
  
  // Enable symlinks
  config.resolver.unstable_enableSymlinks = true;
  config.resolver.unstable_enablePackageExports = true;

  return config;
})();
