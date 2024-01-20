const request = require('supertest');
const { createApp, teardown } = require('../src/app');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { loadWorlds } = require('../src/routes/worlds/worlds.service');
const testWorlds = require('./worlds.testdata');

let mongoServer, app;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = await mongoServer.getUri();
    process.env.MONGO_URL = mongoUri;
    app = await createApp();
    await loadWorlds(testWorlds);
});

afterAll(async () => {
    await teardown();
    await mongoServer.stop();
});

describe('Integration Tests', function () {

    describe('GET /api-docs', function () {
        it('should return the swagger documentation', async () => {
            const res = await request(app)
                .get('/api-docs')
                .expect(200);

            expect(res.body).toHaveProperty('openapi', '3.0.3');
        });
    });

});
