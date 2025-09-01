import express from "express";
import mongoose from "mongoose";

const app = express();

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(3003, () => {
  console.log("Server is running on port 3000");
});
