// External Dependencies
import express, { Request, Response, NextFunction } from "express";
import { Filter } from "mongodb";
import { findWorlds, getWorld, createWorld } from "./worlds.service";
import World from "./worlds.model";
// import log from "../../middleware/logging.middleware"
import { BadRequestError } from "../../middleware/errors.middleware";

// Global Config
const worldsRouter = express.Router();
worldsRouter.use(express.json());

// GET /worlds

worldsRouter.get("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, type } = req.query;
        const filter: Filter<World> = {};
        if (name) {
            filter.name = { $regex: name as string, $options: "i" };
        }
        if (type) {
            filter.type = type as string;
        }
        const worlds = (await findWorlds(filter)) as World[];
        res.status(200).json(worlds);
    } catch (error) {
        next(error as Error);
    }
});

// GET /worlds/:id
worldsRouter.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
        const world = await getWorld(id);
        if (world) {
            res.status(200).json(world);
        }
    } catch (error) {
        next(error as Error);
    }
});

// POST
worldsRouter.post("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.body.name)
            throw new BadRequestError("World name is required");
        if (!req.body.type)
            throw new BadRequestError("World type is required");

        const newWorld = req.body as World;
        // log.info(`about to insert: ${JSON.stringify(newWorld)}`);
        const result = await createWorld(newWorld);
        res.status(201).json(`Successfully created a new world with id ${result.insertedId}`);
    } catch (error) {
        next(error as Error);
    }
});
// PUT
// worldsRouter.put("/:id", async (req: Request, res: Response) => {
//     const { id } = req.params;

//     try {
//         const updatedWorld: World = req.body as World;
//         const query = { _id: id };

//         const result = await createWorld(query, { $set: updatedWorld });

//         result
//             ? res.status(200).json(`Successfully updated game with id ${id}`)
//             : res.status(304).json(`Game with id: ${id} not updated`);
//     } catch (error) {
//         log.error(error);
//         res.status(400).json(getErrorMessage(error));
//     }
// });
// DELETE
// worldsRouter.delete("/:id", async (req: Request, res: Response) => {
//     const id = req?.params?.id;

//     try {
//         const query = { _id: new ObjectId(id) };
//         const result = await collections.worlds?.deleteOne(query);

//         if (result && result.deletedCount) {
//             res.status(202).json(`Successfully removed world with id ${id}`);
//         } else if (!result) {
//             res.status(400).json(`Failed to remove world with id ${id}`);
//         } else if (!result.deletedCount) {
//             res.status(404).json(`World with id ${id} does not exist`);
//         }
//     } catch (error) {
//         log.error(error);
//         res.status(400).json(getErrorMessage(error));
//     }
// });

export default worldsRouter;
