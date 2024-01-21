// External Dependencies
const { MongoClient } = require("mongodb");
const log = require("../middleware/logging.middleware");

// Collection Configuration Class
class CollectionConfig {
    constructor({ dbName, collectionName, indexes, schema }) {
        this.dbName = dbName;
        this.collectionName = collectionName;
        this.indexes = indexes;
        this.schema = schema;
    }

    get db() {
        return this.dbName;
    }

    get collection() {
        return this.collectionName;
    }
}

let client;

// Initialize Connection
async function connectDatabase() {
    try {
        const { MONGO_URL } = process.env;
        client = new MongoClient(MONGO_URL);
        await client.connect();
        log.info(`Successfully connected to MongoDB: ${MONGO_URL}`);
    } catch (error) {
        log.error('Failed to connect to MongoDB: ', error);
        throw error;
    }
}

// Get Collection
function getCollection(collectionConfig) {
    const { dbName, collectionName, /*indexes*/ } = collectionConfig;
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    // indexes.forEach(async (index) => {
    //     await collection.createIndex(index);
    // });
    return collection;
}

async function disconnectDatabase() {
    if (client) {
        await client.close();
        console.log(`Closed database connection`);
    }
}

module.exports = {
    CollectionConfig,
    connectDatabase,
    getCollection,
    disconnectDatabase,
};
