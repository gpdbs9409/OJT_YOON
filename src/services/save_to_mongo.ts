require("dotenv").config();

const mongoose = require("mongoose");
const { getDb } = require("../utils/db");
const { FranchiseSchema } = require("../models/branches_crawling");

// 설빙/미소야 크롤링 모델
async function saveToMongo(docs: any[]) {
  await getDb();
  await FranchiseSchema.deleteMany({});
  try {
    // 스키마 검증됨 (누락되면 ValidationError)
    const result = await FranchiseSchema.insertMany(docs, { ordered: false });
    console.log(`MongoDB 저장 완료: ${result.length}건`);
  } finally {
    await mongoose.disconnect();
  }
}

// 마이프차 API 활용
const RawSchema = new mongoose.Schema({}, { strict: false });
const RawModel =
  mongoose.models.FranchiseRaw ||
  mongoose.model("FranchiseRaw", RawSchema, "franchise_raw");

async function saveToMongoFromApi(docs: any[]) {
  const uri = process.env.MONGODB_URI;
  await mongoose.connect(uri);

  try {
    await RawModel.deleteMany({});
    const result = await RawModel.insertMany(docs, { ordered: false });
    console.log(`MongoDB 저장 완료: ${result.length}건`);
  } finally {
    await mongoose.disconnect();
  }
}

module.exports = { saveToMongo, saveToMongoFromApi };
