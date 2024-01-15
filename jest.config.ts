// jest.config.ts
import type { Config } from '@jest/types';
// Sync object
const config: Config.InitialOptions = {
    verbose: true,
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },
    preset: 'ts-jest',
    setupFiles: [
        'dotenv/config'
    ],
    testEnvironment: 'node',
    collectCoverage: true,
    coveragePathIgnorePatterns: [
        '<rootDir>/node_modules/',
        '<rootDir>/test/',
        '<rootDir>/dist/'
    ],
    modulePathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/dist/'],
    testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/dist/'],
};
export default config;
