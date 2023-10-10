// External Dependencies
import { MongoClient, Db, Collection } from "mongodb";

const { MONGO_HOST, MONGO_USER, MONGO_PASS } = process.env;
// Global Variables
export const collections: { worlds?: Collection } = {}
const dbConfig = {
    url: `mongodb://${MONGO_USER}:${MONGO_PASS}@${MONGO_HOST}`,
    database: 'space',
    collection: 'worlds',
}
// Initialize Connection
export async function connectToDatabase() {
    // dotenv.config();

    const client: MongoClient = new MongoClient(dbConfig.url);

    await client.connect();

    const db: Db = client.db(dbConfig.database);

    const worldsCollection: Collection = db.collection(dbConfig.collection);

    collections.worlds = worldsCollection;

    console.log(`Successfully connected to database: ${dbConfig.database} and collection: ${dbConfig.collection}`);
}
