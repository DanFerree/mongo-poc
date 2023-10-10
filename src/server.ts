import dotenv from 'dotenv'
dotenv.config();
import { Server } from 'http'
import log from './services/logging.service'
import { connectToDatabase } from "./services/database.service"
import app from './app'

const { APP_PORT } = process.env;

const port: number = APP_PORT ? parseInt(APP_PORT) : 3001;

const gracefulShutdown = (server: Server) => {
    log.info('Server closing');

    server.close(() => {
        log.info('Server closed.');
        process.exit(0);
    });
    setTimeout(process.exit(1), 5000);
}

async function start() {
    try {
        // check that require env vars are present
        ['MONGO_HOST', 'MONGO_USER', 'MONGO_PATH'].forEach((varName) => {
            if (!process.env[varName])
                throw new Error(`${varName} is a required env var to start!!!`);
        })
        await connectToDatabase();
        const server = app.listen(port, () => {
            log.info(`Server started at http://localhost:${port}`);
        });

        process.on('SIGINT', () => gracefulShutdown(server))
        process.on('SIGTERM', () => gracefulShutdown(server))
        process.on('message', (msg) => {
            if (msg === 'shutdown') gracefulShutdown(server);
        });
        return server;
    } catch (error) {
        log.error('ERROR starting server', error);
    }
}

start();
