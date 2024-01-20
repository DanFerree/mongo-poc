// External Dependencies
const express = require("express");
const { findWorlds, getWorld, createWorld, updateWorld, deleteWorld } = require("./worlds.service");
const log = require("../../middleware/logging.middleware");
const { BadRequestError } = require("../../middleware/errors.middleware");

// Global Config
const worldsRouter = express.Router();

/**
 * @swagger
 * /worlds:
 *   get:
 *     summary: Get a list of worlds
 *     description: Retrieve a list of worlds based on optional query parameters.
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filter worlds by name (case-insensitive)
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: Filter worlds by type
 *     responses:
 *       200:
 *         description: A list of worlds
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WorldList'
 */
// Search - GET /worlds
worldsRouter.get("/", async (req, res, next) => {
    // log.debug(`GET /worlds: ${JSON.stringify(req.query)}`);
    try {
        const { name, type } = req.query;
        const filter = {};
        if (name) {
            filter.name = { $regex: name, $options: "i" };
        }
        if (type) {
            filter.type = type;
        }
        const worlds = await findWorlds(filter);
        res.status(200).json(worlds);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /worlds/{id}:
 *   get:
 *     summary: Get a world by ID
 *     description: Retrieve a world by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the world to retrieve
 *     responses:
 *       200:
 *         description: The requested world
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/World'
 */
// Read - GET /worlds/:id
worldsRouter.get("/:id", async (req, res, next) => {
    const { id } = req.params;
    log.debug(`GET /worlds/${id}}`);
    try {
        const world = await getWorld(id);
        if (world) {
            res.status(200).json(world);
        }
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /worlds:
 *   post:
 *     summary: Create a new world
 *     description: Create a new world with the provided data.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewWorld'
 *     responses:
 *       201:
 *         description: The newly created world
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/World'
 */
// Create - POST /worlds
worldsRouter.post("/", async (req, res, next) => {
    log.debug(`POST /worlds: ${JSON.stringify(req.body)}`);
    try {
        if (!req?.body?.name)
            throw new BadRequestError("World name is required");
        if (!req?.body?.type)
            throw new BadRequestError("World type is required");

        const newWorld = req.body;
        // log.info(`about to insert: ${JSON.stringify(newWorld)}`);
        const result = await createWorld(newWorld);
        const world = await getWorld(result.insertedId);
        res.status(201).json(world);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /worlds/{id}:
 *   put:
 *     summary: Update a world by ID
 *     description: Update an existing world with the provided data.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the world to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateWorld'
 *     responses:
 *       200:
 *         description: The updated world
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/World'
 */
// Update - PUT /worlds/:id
worldsRouter.put("/:id", async (req, res, next) => {
    const id = req?.params?.id;
    log.debug(`PUT /worlds/${id}: ${JSON.stringify(req.body)}`);
    try {
        if (!req?.body?.name)
            throw new BadRequestError("World name is required");
        if (!req?.body?.type)
            throw new BadRequestError("World type is required");
        // await getWorld(id);
        const result = await updateWorld(id, req.body);
        log.debug(`PUT /worlds/${id} result: ${JSON.stringify(result, null, 2)}`);
        const world = await getWorld(id);
        res.status(202).json(world);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /worlds/{id}:
 *   delete:
 *     summary: Delete a world by ID
 *     description: Delete an existing world by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the world to delete
 *     responses:
 *       202:
 *         description: The world was successfully deleted
 *       400:
 *         description: Failed to delete the world
 *       404:
 *         description: The world with the specified ID does not exist
 */
// Delete - DELETE /worlds/:id
worldsRouter.delete("/:id", async (req, res, next) => {
    const id = req?.params?.id;
    log.debug(`DELETE /worlds/${id}`);
    try {
        await getWorld(id);
        await deleteWorld(id);
        res.status(204).json({});
    } catch (error) {
        next(error);
    }

});

module.exports = worldsRouter;
