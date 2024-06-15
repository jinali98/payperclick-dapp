require("dotenv").config();
import express from "express";
import { NextFunction, Request, Response } from "express";

import creatorRouter from "./routes/creator";
import workerRouter from "./routes/worker";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// create routes for the creators
app.use("/api/v1/creator", creatorRouter);
app.use("api/v1//worker", workerRouter);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).send({
    status: "error",
    message: err.message,
  });
});
// start the server
app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
