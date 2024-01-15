// External Dependencies
import { MongoClient, Db, Collection, IndexSpecification } from "mongodb";
import log from "../middleware/logging.middleware";

// Collection Configuration Class
export class CollectionConfig {
    dbName: string;
    collectionName: string;
    indexes: IndexSpecification[];
    schema: object;

    constructor({ dbName, collectionName, indexes, schema }: { dbName: string, collectionName: string, indexes: IndexSpecification[], schema: object }) {
        this.dbName = dbName;
        this.collectionName = collectionName;
        this.indexes = indexes;
        this.schema = schema;
    }

    get db(): string {
        return this.dbName;
    }

    get collection(): string {
        return this.collectionName;
    }

}

let client: MongoClient;

// Initialize Connection
export async function connectDatabase() {
    try {
        const { MONGO_URL } = process.env;
        client = new MongoClient(MONGO_URL as string);
        await client.connect();
        log.info(`Successfully connected to MongoDB: ${MONGO_URL}`);
    } catch (error) {
        log.error('Failed to connect to MongoDB: ', error);
        throw error;
    }
}

// Get Collection
export function getCollection(collectionConfig: CollectionConfig): Collection {
    const { dbName, collectionName, indexes } = collectionConfig;
    const db: Db = client.db(dbName);
    const collection: Collection = db.collection(collectionName);
    indexes.forEach(async (index) => {
        await collection.createIndex(index);
    });
    return collection;
}

export async function disconnectDatabase() {
    await client.close();
    console.log(`Closed database connection`);
}
