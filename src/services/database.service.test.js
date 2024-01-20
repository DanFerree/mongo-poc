const { MongoParseError } = require('mongodb');
const { connectDatabase } = require('./database.service');

describe('Database Service', () => {
    it('should throw an error if MONGO_URL is invalid', async () => {
        process.env.MONGO_URL = 'invalid-url';
        try {
            await connectDatabase();
            throw new Error('Should not reach this point');
        } catch (error) {
            console.log(`error type: ${typeof error}`);
            expect(error).toBeInstanceOf(MongoParseError);
        }
    });
});
