import express, { Request, Response } from "express"; //commonjs 방식으로 임포트
import mongoose from "mongoose";

const app = express();

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World");
});

const main = async () => {
  await mongoose.connect(process.env.MONGODB_URI as string);
  app.listen(3004, () => {
    console.log("Server is running on port 3000");
  });
};

main();
