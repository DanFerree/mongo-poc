// jest.config.ts
import type { Config } from '@jest/types';
// Sync object
const config: Config.InitialOptions = {
    verbose: true,
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },
    setupFiles: [
        'dotenv/config'
    ],
    collectCoverage: true
};
export default config;
