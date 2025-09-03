import mongoose from "mongoose";

const branchSchema = new mongoose.Schema(
  {
    name: String,
    addr: String,
    tel: String,
    period: String,
  },
  { timestamps: true }
); // createdAt, updatedAt 자동 생성

const latest_version_pk_schema = new mongoose.Schema(
  {
    latestVersionPk: String,
  },
  { timestamps: true }
); // createdAt, updatedAt 자동 생성

const branch = mongoose.model("branch", branchSchema, "branch");
const latest_version_pk = mongoose.model(
  "latest_version_pk",
  latest_version_pk_schema,
  "latest_version_pk"
);
export { branch, latest_version_pk };
