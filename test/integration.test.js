const request = require('supertest');
const stringify = require('json-stringify-safe');
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
        it('should return the swagger documentation web GUI', async () => {
            const res = await request(app)
                .get('/api-docs/')
                .expect(200);
            // console.log(res.text);

            expect(res.text).toContain('<div id="swagger-ui"></div>');
        });
        it('should return the swagger documentation as json', async () => {
            const res = await request(app)
                .get('/api-docs.json')
                .set('Accept', 'application/json')
                .expect(200);
            console.log(stringify(res.body, null, 2));
            expect(res.body.info.title).toBe('Hello World API');
        });
    });

});
