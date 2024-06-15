import { Request, Response, Router } from "express";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { authMiddleware } from "../middlewares/auth-middleware";
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

export default creatorRouter;
