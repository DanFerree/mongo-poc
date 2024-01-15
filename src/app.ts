import express from 'express'
import worldsRouter from "./routes/worlds/worlds.router";
import cors from 'cors'
import { connectDatabase, disconnectDatabase } from "./services/database.service"
import { errorHandler } from "./middleware/errors.middleware";
export async function teardown() {
    await disconnectDatabase();
}

export async function setup() {
    // check that require env vars are present
    ['MONGO_HOST', 'MONGO_USER', 'MONGO_PASS'].forEach((varName) => {
        if (!process.env[varName])
            throw new Error(`${varName} is a required env var to start!!!`);
    });
    try {
        await connectDatabase();
    } catch (error) {
        throw new Error('Connection to database failed: ' + error)
    }
}


const app: express.Application = express()

app.use(cors());
app.use(express.json());

app.use("/worlds", worldsRouter);

app.use(errorHandler);

export default app;
