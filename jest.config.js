module.exports = {
  preset: 'ts-jest',
  testMatch: [
    "**/test/**/*.test.(ts|js)",
    "!**/dist/**/*.(ts|js)"
  ],
  testEnvironment: 'node',
};