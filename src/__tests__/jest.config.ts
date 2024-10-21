module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleFileExtensions: ['ts', 'js'],
    transform: {
      '^.+\\.(ts|tsx)$': 'ts-jest',
    },
    testMatch: ['**/__tests__/**/*.test.(ts|js)'],
    moduleDirectories: ['node_modules', 'src'],
    coverageDirectory: './coverage',
    collectCoverageFrom: ['src/**/*.{ts,js}', '!src/**/*.d.ts'],
};
  