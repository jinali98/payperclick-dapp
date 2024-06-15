import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
// write the auth middleware
export const authMiddleware = async (
  req: Request & { userid?: string }, // Add 'userid' property to the Request type
  res: Response,
  next: NextFunction
) => {
  const authorization = req.headers["authorization"];
  try {
    if (!authorization) {
      throw new Error("Not authenticated");
    }
    const token = authorization.split(" ")[1];

    const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as any;
    if (payload?.userid) {
      req.userid = payload.userid;
    }

    next();
  } catch (err) {
    console.error(err);
    //  return next with an error
    next(new Error("Not authenticated"));
  }
};
