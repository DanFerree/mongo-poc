// jest.config.js
const config = {
    verbose: true,
    setupFiles: [
        'dotenv/config'
    ],
    // moduleDirectories: ['node_modules', 'src'],
    testEnvironment: 'node',
    collectCoverage: true,
    // coveragePathIgnorePatterns: [
    //     '<rootDir>/node_modules/',
    //     '<rootDir>/test/',
    //     '<rootDir>/dist/'
    // ],
    // modulePathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/dist/'],
    // testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/dist/'],
};

module.exports = config;
