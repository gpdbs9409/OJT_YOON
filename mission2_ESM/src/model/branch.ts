import mongoose from "mongoose";

const branchSchema = new mongoose.Schema({
  name: String,
  addr: String,
  tel: String,
  period: String,
  timestamp: String, // 소문자로 통일
});

const branch = mongoose.model("branch", branchSchema, "branch");

export { branch };
