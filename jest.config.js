module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['test/unit'],
  coverageDirectory: 'coverage',
  coverageReporters: ['lcov', 'text'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    '^@flexpect/(.*)$': '<rootDir>/src/$1',
  },
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
};
