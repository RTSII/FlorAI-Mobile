// Babel configuration for testing
module.exports = {
  presets: [
    ['@babel/preset-env', {targets: {node: 'current'}}],
    '@babel/preset-typescript',
    '@babel/preset-react',
  ],
  plugins: [
    '@babel/plugin-transform-modules-commonjs',
    'react-native-reanimated/plugin',
  ],
};
