module.exports = {
  clearMocks: true,
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/test/unit'],
  coverageDirectory: 'coverage',
  coverageReporters: ['lcov', 'text'],
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  moduleNameMapper: {
    '^@flexpect/(.*)$': '<rootDir>/src/$1',
    '^@helpers/(.*)$': '<rootDir>/src/helpers/$1',
    '^@matchers/(.*)$': '<rootDir>/src/matchers/$1',
  },
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
};
