module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(axios)/)',
  ],
  moduleNameMapper: {
    '^axios$': '<rootDir>/node_modules/axios/dist/axios.js',
    '\\.(css|less|scss|sass)$': '<rootDir>/src/__mocks__/styleMock.js'
  },
  testEnvironmentOptions: {
    url: 'http://localhost'
  },
  globals: {
    'ts-jest': {
      isolatedModules: true
    }
  }
};