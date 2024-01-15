import { getCollection } from '../../services/database.service';
import { InsertOneResult, ObjectId } from 'mongodb';
import World, { collectionConfig } from './worlds.model';
// import log from '../../middleware/logging.middleware';
import { BadRequestError, InternalServerError, NotFoundError } from '../../middleware/errors.middleware';

const worlds = getCollection(collectionConfig);

export async function createWorld(world: object): Promise<InsertOneResult> {
    try {
        return await worlds.insertOne(world);
    } catch (error) {
        //TODO: if error is a duplicate key error, throw a BadRequestError
        //TODO: if error is a validation error, throw a BadRequestError
        throw new InternalServerError(new Error('Database not initialized'));
    }
}

export async function loadWorlds(newWorlds: Array<object>): Promise<void> {
    try {
        await worlds.insertMany(newWorlds);
    } catch (error) {
        throw new InternalServerError(error as Error);
    }
}

export async function findWorlds(search: object): Promise<Array<World>> {
    try {
        const result: unknown = await worlds.find(search).toArray();
        return result as Array<World>;
    } catch (error) {
        throw new InternalServerError(error as Error);
    }

}

export async function getWorld(id: string): Promise<World | null> {
    if (!worlds) {
        throw new Error('Database not initialized');
    }
    if (!ObjectId.isValid(id)) {
        throw new BadRequestError(`Invalid ObjectId: ${id}`);
    }
    try {
        const result = await worlds.findOne({ _id: new ObjectId(id) }) as unknown as World;
        return result;
    } catch (error) {
        // log.warn(error);
        throw new NotFoundError(new ObjectId(id), 'World');
    }
}
