const { connectDatabase } = require('./database.service');

describe('Database Service', () => {
    it('should throw an error if MONGO_URL is invalid', async () => {
        process.env.MONGO_URL = 'invalid-url';
        try {
            await connectDatabase();
            throw new Error('Should not reach this point');
        } catch (error) {
            expect(error.message).toContain('Invalid scheme');
        }
    });
});
