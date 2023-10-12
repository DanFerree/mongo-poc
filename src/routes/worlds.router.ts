// External Dependencies
import express, { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { collections } from "../services/database.service";
import World from "../models/world";
import log from "../services/logging.service"
import { getErrorMessage } from "../services/util.service"
// Global Config
export const worldsRouter = express.Router();
worldsRouter.use(express.json());

// GET

worldsRouter.get("/", async (_req: Request, res: Response) => {
    try {
        const worlds = (await collections.worlds?.find({}).toArray()) as unknown as World[];

        res.status(200).json(worlds);
    } catch (error) {
        res.status(500).json(getErrorMessage(error));
    }
});

worldsRouter.get("/:id", async (req: Request, res: Response) => {
    const id = req?.params?.id;

    try {

        const query = { _id: new ObjectId(id) };
        const world = (await collections.worlds?.findOne(query)) as unknown as World;

        if (world) {
            res.status(200).json(world);
        }
    } catch (error) {
        res.status(404).json(`Unable to find matching document with id: ${req.params.id}`);
    }
});

// POST
worldsRouter.post("/", async (req: Request, res: Response) => {
    try {
        //TODO: input validations
        const newWorld = req.body as World;
        // log.info(`about to insert: ${JSON.stringify(newWorld)}`);
        const result = await collections.worlds?.insertOne(newWorld).catch((error) => {
            log.error(error);
        });
        // log.info(JSON.stringify(result))

        result
            ? res.status(201).json(`Successfully created a new world with id ${result.insertedId}`)
            : res.status(500).json("Failed to create a new world.");
    } catch (error) {
        log.error(error);
        res.status(400).json(getErrorMessage(error));
    }
});
// PUT
worldsRouter.put("/:id", async (req: Request, res: Response) => {
    const id = req?.params?.id;

    try {
        const updatedWorld: World = req.body as World;
        const query = { _id: new ObjectId(id) };

        const result = await collections.worlds?.updateOne(query, { $set: updatedWorld });

        result
            ? res.status(200).json(`Successfully updated game with id ${id}`)
            : res.status(304).json(`Game with id: ${id} not updated`);
    } catch (error) {
        log.error(error);
        res.status(400).json(getErrorMessage(error));
    }
});
// DELETE
worldsRouter.delete("/:id", async (req: Request, res: Response) => {
    const id = req?.params?.id;

    try {
        const query = { _id: new ObjectId(id) };
        const result = await collections.worlds?.deleteOne(query);

        if (result && result.deletedCount) {
            res.status(202).json(`Successfully removed world with id ${id}`);
        } else if (!result) {
            res.status(400).json(`Failed to remove world with id ${id}`);
        } else if (!result.deletedCount) {
            res.status(404).json(`World with id ${id} does not exist`);
        }
    } catch (error) {
        log.error(error);
        res.status(400).json(getErrorMessage(error));
    }
});
