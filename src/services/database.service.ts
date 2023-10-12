// External Dependencies
import { MongoClient, Db, Collection } from "mongodb";

const { MONGO_HOST, MONGO_USER, MONGO_PASS, MONGO_DATABASE } = process.env;
// Global Variables
export const collections: { worlds?: Collection } = {}
const dbConfig = {
    url: `mongodb://${MONGO_USER}:${MONGO_PASS}@${MONGO_HOST}`,
    database: MONGO_DATABASE || 'space',
    collection: 'worlds',
}
let client: MongoClient;
// Initialize Connection
export async function connectToDatabase() {
    // dotenv.config();

    client = new MongoClient(dbConfig.url);

    await client.connect();

    const db: Db = client.db(dbConfig.database);

    const worldsCollection: Collection = db.collection(dbConfig.collection);

    collections.worlds = worldsCollection;

    console.log(`Successfully connected to database: ${dbConfig.database} and collection: ${dbConfig.collection}`);
}
export async function disconnect() {
    await client.close();
    console.log(`closed database connection`);
}
