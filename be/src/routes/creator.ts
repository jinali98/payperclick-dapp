import { Request, Response, Router } from "express";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { authMiddleware } from "../middlewares/auth-middleware";
import { createTaskInputType } from "../types";
const prismaClient = new PrismaClient();

const creatorRouter = Router();

creatorRouter.post("/connect", async (req: Request, res: Response) => {
  try {
    const walletAddress = "0X";
    let userid: number | null = null;

    const creator = await prismaClient.creator.findFirst({
      where: {
        address: walletAddress,
      },
    });

    if (!creator) {
      const creator = await prismaClient.creator.create({
        data: {
          address: walletAddress,
        },
      });

      userid = creator.id;
    }

    const token = jwt.sign(
      { userid: userid || creator?.id },
      process.env.ACCESS_TOKEN_SECRET!
    );

    return res.json({ token });
  } catch (err) {
    const message = err instanceof Error ? err.message : "An error occurred";
    return res.status(500).json({ error: message });
  }
});

creatorRouter.get(
  "/pre-signed-url",
  authMiddleware,
  async (
    req: Request & { userid?: string }, // Add 'userid' property to the Request type
    res: Response
  ) => {
    try {
      const userid = req?.userid;
      console.log({ userid });
      const client = new S3Client({ region: process.env.AWS_REGION });
      const command = new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET,
        Key: `creator/${userid}/${Math.random()}.jpg`,
      });

      const url = await getSignedUrl(client, command, { expiresIn: 3600 });
      return res.json({ url });
    } catch (err) {
      console.log(err);
      const message = err instanceof Error ? err.message : "An error occurred";
      return res.status(500).json({ error: message });
    }
  }
);

creatorRouter.get(
  "/task/:id",
  authMiddleware,
  async (req: Request & { userid?: string }, res: Response) => {
    try {
      const userid = req?.userid;
      const taskid = parseInt(req.params.id);

      const task = await prismaClient.task.findFirst({
        where: {
          id: taskid,
          creator_id: parseInt(userid!),
        },
        include: {
          options: true,
          submissions: true,
        },
      });

      return res.json({ success: true, data: task });
    } catch (err) {
      console.log(err);
      const message = err instanceof Error ? err.message : "An error occurred";
      return res.status(500).json({ error: message });
    }
  }
);

creatorRouter.post(
  "/task",
  authMiddleware,
  async (req: Request & { userid?: string }, res: Response) => {
    try {
      const userid = req?.userid;

      const validatedInput = createTaskInputType.safeParse(req.body);

      if (!validatedInput.success) {
        return res.status(400).json({
          error: validatedInput.error.issues,
        });
      }

      const createTaskTx = await prismaClient.$transaction(async (tx) => {
        const createTaskResponse = await tx.task.create({
          data: {
            title: validatedInput.data.title,
            creator_id: parseInt(userid!),
            signature: validatedInput.data.signature,
            amount: "0.1",
          },
        });

        const taskOptions = validatedInput.data.options.map((option, index) => {
          return {
            image_url: option.imageUrl,
            option_id: ++index,
            task_id: createTaskResponse.id,
            count: 0,
          };
        });

        await tx.option.createMany({
          data: taskOptions,
        });

        return createTaskResponse;
      });

      return res.json({ success: true, data: createTaskTx });
    } catch (err) {
      console.log(err);
      const message = err instanceof Error ? err.message : "An error occurred";
      return res.status(500).json({ error: message });
    }
  }
);

export default creatorRouter;
