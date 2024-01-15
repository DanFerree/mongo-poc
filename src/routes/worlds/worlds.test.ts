import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app, { setup, teardown } from '../../app'
import { ObjectId } from 'mongodb';
import { loadWorlds } from './worlds.service';
import testWorlds from '../../../test/worlds.testdata';

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

describe('Worlds Router', function () {
    describe('GET /worlds/:id', function () {
        it('should return a world with the given id', async function () {
            const id = new ObjectId();
            // Assuming you have a function to create a world in your test setup
            // await createWorld({ _id: id, name: 'Test World' });

            const res = await request(app)
                .get(`/worlds/${id}`)
                .expect(200);

            expect(res.body).toHaveProperty('_id', id.toString());
            expect(res.body).toHaveProperty('name', 'Test World');
        });

        it('should return 404 if no world with the given id exists', async function () {
            const id = new ObjectId();

            const res = await request(app)
                .get(`/worlds/${id}`)
                .expect(404);

            expect(res.body).toBe(`Unable to find matching document with id: ${id}`);
        });
    });

    describe('POST /worlds', function () {
        it('should create a new world and return it', async function () {
            const newWorld = { name: 'New World' };

            const res = await request(app)
                .post('/worlds')
                .send(newWorld)
                .expect(201);

            expect(res.body).toHaveProperty('name', 'New World');
        });
    });
});
