const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { createApp, teardown } = require('../../app');
const { ObjectId } = require('mongodb');
const { loadWorlds } = require('./worlds.service');
const testWorlds = require('../../../test/worlds.testdata');

let mongoServer, app;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    process.env.MONGO_URL = mongoUri;
    app = await createApp();
    await loadWorlds(testWorlds);
});

afterAll(async () => {
    await teardown();
    await mongoServer.stop();
});

describe('Worlds API', function () {

    describe('GET /worlds', function () {
        it('should get an array of all worlds', async () => {
            const res = await request(app)
                .get('/worlds')
                .expect(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBe(testWorlds.length);
        });

        it('should only return worlds with ur in the name', async () => {
            const res = await request(app)
                .get('/worlds?name=ur')
                .expect(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBe(3);// Saturn, Mercury, Uranus
        });

        it('should only return worlds with type of jovian', async () => {
            const res = await request(app)
                .get('/worlds?type=jovian')
                .expect(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBe(4);// Saturn, Jupiter, Uranus, Neptune
        });
    });

    let worldId;
    describe('Create - POST /worlds', function () {
        it('should return 400 if no body is provided', async () => {
            const res = await request(app)
                .post('/worlds')
                .expect(400);

            expect(res.body.message).toBe('World name is required');
        });
        it('should return 400 if no name is provided', async () => {
            const newWorld = { type: 'terrestrial' };

            const res = await request(app)
                .post('/worlds')
                .send(newWorld)
                .expect(400);

            expect(res.body.message).toBe('World name is required');
        });
        it('should return 400 if no type is provided', async () => {
            const newWorld = { name: 'New World' };

            const res = await request(app)
                .post('/worlds')
                .send(newWorld)
                .expect(400);

            expect(res.body.message).toBe('World type is required');
        });
        it('should create a new world and return it with an id', async () => {
            const newWorld = { name: 'New World', type: 'terrestrial' };

            const res = await request(app)
                .post('/worlds')
                .send(newWorld)
                .expect(201);

            expect(res.body).toHaveProperty('name', 'New World');
            expect(res.body).toHaveProperty('type', 'terrestrial');
            expect(res.body).toHaveProperty('_id');
            worldId = res.body._id;

            const world = await request(app)
                .get(`/worlds/${worldId}`)
                .expect(200);
            expect(world.body).toHaveProperty('name', 'New World');
        });
    });

    describe('Read - GET /worlds/:id', function () {
        it('should return a world with the given id', async () => {
            const id = new ObjectId(worldId);
            // Assuming you have a function to create a world in your test setup
            // await createWorld({ _id: id, name: 'Test World' });

            const res = await request(app)
                .get(`/worlds/${id}`)
                .expect(200);

            expect(res.body).toHaveProperty('_id', id.toString());
            expect(res.body).toHaveProperty('name', 'New World');
            expect(res.body).toHaveProperty('type', 'terrestrial');
        });

        it('should return 404 if no world with the given id exists', async () => {
            const id = 'doesnotexist';

            const res = await request(app)
                .get(`/worlds/${id}`)
                .expect(404);

            expect(res.body.message).toBe(`World with id: ${id} not found`);
        });
    });

    describe('Update - PUT /worlds/:id', function () {
        it('should return 400 if no body is provided', async () => {
            const res = await request(app)
                .put('/worlds/:id')
                .expect(400);

            expect(res.body.message).toBe('World name is required');
        });
        it('should return 400 if no name is provided', async () => {
            const newWorld = { type: 'terrestrial' };

            const res = await request(app)
                .put('/worlds/:id')
                .send(newWorld)
                .expect(400);

            expect(res.body.message).toBe('World name is required');
        });
        it('should return 400 if no type is provided', async () => {
            const newWorld = { name: 'Error World' };

            const res = await request(app)
                .put('/worlds/:id')
                .send(newWorld)
                .expect(400);

            expect(res.body.message).toBe('World type is required');
        });
        it('should update the world by id', async () => {
            const updatedWorld = { name: 'Updated World', type: 'jovian' };

            const res = await request(app)
                .put('/worlds/:id')
                .send(updatedWorld)
                .expect(202);

            expect(res.body).toHaveProperty('name', 'Updated World');
            expect(res.body).toHaveProperty('type', 'jovian');
            expect(res.body).toHaveProperty('_id');

            const world = await request(app)
                .get(`/worlds/${worldId}`)
                .expect(200);
            expect(world.body).toHaveProperty('name', 'Updated World');
            expect(world.body).toHaveProperty('type', 'jovian');
        });
    });


    describe('Delete - DELETE /worlds/:id', function () {
        it('should delete the world with the given id', async () => {
            const id = new ObjectId(worldId);

            const res = await request(app)
                .delete(`/worlds/${id}`)
                .expect(204);

            expect(res.body).toStrictEqual({});
        });

        it('should return 404 if no world with the given id exists', async () => {
            const id = new ObjectId(worldId);

            const res = await request(app)
                .delete(`/worlds/${id}`)
                .expect(404);

            expect(res.body.message).toBe(`World not found: ${id}`);
        });
    });
});
