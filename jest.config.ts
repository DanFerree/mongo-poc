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
    collectCoverage: true
};
export default config;
