import request from 'supertest';
import app, { setup, teardown } from '../src/app'
import { MongoMemoryServer } from 'mongodb-memory-server';
import { loadWorlds } from '../src/routes/worlds/worlds.service';
import testWorlds from './worlds.testdata';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
    mongoServer = new MongoMemoryServer();
    const mongoUri: string = await mongoServer.getUri();
    process.env.MONGO_URL = mongoUri;
    await setup();
    await loadWorlds(testWorlds);
});

afterAll(async () => {
    await teardown();
    await mongoServer.stop();
});

describe('Integration Tests', function () {
    beforeAll(async () => {
        await setup();
    });
    afterAll(async () => {
        await teardown();
    })

    describe('GET /api-docs', function () {
        it('should return the swagger documentation', async function () {
            const res = await request(app)
                .get('/api-docs')
                .expect(200);

            expect(res.body).toHaveProperty('openapi', '3.0.3');
        });
    });

});
