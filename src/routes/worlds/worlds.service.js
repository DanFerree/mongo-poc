const { ObjectId } = require('mongodb');
const { BadRequestError, InternalServerError, NotFoundError } = require('../../middleware/errors.middleware');
const log = require('../../middleware/logging.middleware');
const { getCollection } = require('../../services/database.service');
const { database } = require('./worlds.config');
let worlds;

async function createWorld(world) {
    if (!worlds) worlds = getCollection(database);
    try {
        return await worlds.insertOne(world);
    } catch (error) {
        //TODO: if error is a duplicate key error, throw a BadRequestError
        //TODO: if error is a validation error, throw a BadRequestError
        throw new InternalServerError(new Error('Database not initialized'));
    }
}

async function loadWorlds(newWorlds) {
    if (!worlds) worlds = getCollection(database);
    try {
        await worlds.insertMany(newWorlds);
    } catch (error) {
        throw new InternalServerError(error);
    }
}

async function findWorlds(search) {
    if (!worlds) worlds = getCollection(database);
    try {
        const result = await worlds.find(search).toArray();
        return result;
    } catch (error) {
        throw new InternalServerError(error);
    }
}

async function getWorld(id) {
    if (!worlds) worlds = getCollection(database);
    if (!ObjectId.isValid(id)) {
        throw new BadRequestError(`Invalid ObjectId: ${id}`);
    }
    const _id = new ObjectId(id);
    try {
        const result = await worlds.findOne({ _id });
        log.debug(`getWorld(${id}): ${JSON.stringify(result, null, 2)}`)
        if (result?._id !== _id) throw new NotFoundError(_id, 'World');
        return result;
    } catch (error) {
        if (error instanceof NotFoundError) throw error;
        throw new InternalServerError(error);
    }
}

async function updateWorld(id, world) {
    if (!worlds) worlds = getCollection(database);
    if (!ObjectId.isValid(id)) {
        throw new BadRequestError(`Invalid ObjectId: ${id}`);
    }
    const _id = new ObjectId(id);
    try {
        const result = await worlds.updateOne({ _id }, { $set: world });
        log.debug(`updateWorld(${_id}): ${JSON.stringify(result, null, 2)}`);
        if (!result.modifiedCount) throw new NotFoundError(_id, 'World');
        const updatedWorld = await getWorld(_id);
        return updatedWorld;
    } catch (error) {
        if (error instanceof NotFoundError) throw error;
        throw new InternalServerError(error);
    }
}

async function deleteWorld(id) {
    if (!worlds) worlds = getCollection(database);
    if (!ObjectId.isValid(id)) {
        throw new BadRequestError(`Invalid ObjectId: ${id}`);
    }
    try {
        const _id = new ObjectId(id);
        const result = await worlds.deleteOne({ _id });
        log.debug(`deleteWorld(${id}): ${JSON.stringify(result, null, 2)}`);
        if (!result.deletedCount) throw new NotFoundError(_id, 'World');
        return result;
    } catch (error) {
        if (error instanceof NotFoundError) throw error;
        throw new InternalServerError(error);
    }
}
module.exports = {
    createWorld,
    loadWorlds,
    findWorlds,
    getWorld,
    updateWorld,
    deleteWorld,
};
