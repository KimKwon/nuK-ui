module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/__test__/setup.ts'],
  testMatch: ['<rootDir>/**/__test__/**/*.test.(js|jsx|ts|tsx)'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  transformIgnorePatterns: ['<rootDir>/node_modules/', 'dist', 'build'],
};
