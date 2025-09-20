export default {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.{test,spec}.js'],
  collectCoverageFrom: [
    'src/**/*.{js,vue}',
    '!src/main.js',
    '!**/node_modules/**'
  ]
};
