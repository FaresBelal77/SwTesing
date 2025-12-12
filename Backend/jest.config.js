module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.js'],
  setupFilesAfterEnv: ['<rootDir>/__tests__/setup.js'],
  // Run tests serially to prevent data leakage between test files
  maxWorkers: 1,
  // Ensure each test file runs in isolation
  testSequencer: undefined,
  // Clear module cache between test files
  clearMocks: true,
  // Reset modules between test files
  resetMocks: true,
  // Restore mocks between tests
  restoreMocks: true,
  collectCoverageFrom: [
    'Controllers/**/*.js',
    'Routes/**/*.js',
    'Middleware/**/*.js',
    '!**/node_modules/**',
  ],
  coverageDirectory: 'coverage',
  verbose: true,
};

