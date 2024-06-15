import { PrismaClient } from "@prisma/client";
import { Request, Response, Router } from "express";
import jwt from "jsonwebtoken";
const prismaClient = new PrismaClient();

const workerRouter = Router();

workerRouter.post("/connect", async (req: Request, res: Response) => {

});

export default workerRouter;
