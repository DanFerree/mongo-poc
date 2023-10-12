import request from 'supertest';
import app, { setup, teardown } from '../src/app'
import testData from './testData';

describe('Integration Tests', function () {
    beforeAll(async () => {
        await setup();
    });
    afterAll(async () => {
        await teardown();
    })

    describe('POST /worlds', function () {
        it('successfully inserts all test data', function (done) {
            Promise.all(
                testData.worlds.map((world) => {
                    // const body = JSON.stringify(world);
                    // console.log(`sending: ${body}`)
                    return request(app)
                        .post('/worlds')
                        .set('Accept', 'application/json')
                        .set('Content-Type', 'application/json')
                        .send(world)
                        // .expect(function (res) {
                        //     // res.body.id = 'some fixed id';
                        //     // res.body.name = res.body.name.toLowerCase();
                        //     console.log(res.body)
                        // })
                        .expect('Content-Type', /json/)
                        .expect(201)
                })
            )
                .then(() => { done(); })
                .catch((error) => done(error));
        });
    });

    describe('GET /worlds', function () {
        it('responds with json', function (done) {
            request(app)
                .get('/worlds')
                .set('Accept', 'application/json')
                .expect(function (res) {
                    // res.body.id = 'some fixed id';
                    // res.body.name = res.body.name.toLowerCase();
                    console.log(res.body)
                })
                .expect('Content-Type', /json/)
                .expect(200, done)
            // .catch((error) => console.log(error));
        });
    });

});
