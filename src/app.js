const express = require('express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const worldsApi = require("./routes/worlds");
const cors = require('cors');
const { connectDatabase, disconnectDatabase } = require("./services/database.service");
const { errorHandler, errorSchema } = require("./middleware/errors.middleware");

async function teardown() {
    await disconnectDatabase();
}

async function setup() {
    // check that require env vars are present
    ['MONGO_URL'].forEach((varName) => {
        if (!process.env[varName])
            throw new Error(`${varName} is a required env var to start!!!`);
    });
    try {
        await connectDatabase();
    } catch (error) {
        throw new Error('Connection to database failed: ' + error)
    }
}



async function createApp() {
    await setup();

    const app = express();
    app.use(cors());
    app.use(express.json());

    // Generate OpenAPI specification
    const options = {
        definition: {
            openapi: '3.0.0',
            info: {
                title: 'Hello World API',
                version: '1.0.0',
            },
            components: {
                schemas: {
                    ...errorSchema,
                    ...worldsApi.config.schema,
                }
            },
        },
        apis: ['./src/routes/*/*.router.js'], // Specify the path to your route files
    };
    const swaggerSpec = swaggerJsdoc(options);

    // Serve the Swagger UI at /api-docs
    app.get('/api-docs.json', (_req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(swaggerSpec);
    });
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    app.get('/', (_req, res) => {
        res.redirect('/api-docs/');
    });

    app.use(worldsApi.config.baseUrl, worldsApi.router);

    app.use(errorHandler);

    return app;
}

module.exports = {
    createApp,
    teardown,
};
