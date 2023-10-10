import express from 'express'
import { worldsRouter } from "./routes/worlds.router";

const app: express.Application = express()


app.use("/worlds", worldsRouter);


export default app;
