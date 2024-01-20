const log = require('./middleware/logging.middleware');
const { createApp, teardown } = require('./app');
let app;

const { APP_PORT } = process.env;

const port = APP_PORT ? parseInt(APP_PORT) : 3001;

const gracefulShutdown = async (server) => {
    log.info('Server closing');
    await teardown();
    server.close(() => {
        log.info('Server closed.');
        process.exit(0);
    });
    setTimeout(() => process.exit(1), 5000);
};

async function start() {
    try {
        app = await createApp();
        const server = app.listen(port, () => {
            log.info(`Server started at http://localhost:${port}`);
        });

        process.on('SIGINT', () => gracefulShutdown(server));
        process.on('SIGTERM', () => gracefulShutdown(server));
        process.on('message', (msg) => {
            if (msg === 'shutdown') gracefulShutdown(server);
        });
        return server;
    } catch (error) {
        log.error('ERROR starting server');
        log.error(error);
    }
}

start();
