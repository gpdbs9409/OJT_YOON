require("dotenv").config();

const mongoose = require("mongoose");
const { connectMongoose } = require("../models/database");
const { FranchiseSchema } = require("../models/branches_crawling");

// 설빙/미소야 크롤링 모델 저장
async function saveToMongo(docs: any[]) {
  await connectMongoose();
  await FranchiseSchema.deleteMany({});
  try {
    // 스키마 검증됨 (누락되면 ValidationError)
    const result = await FranchiseSchema.insertMany(docs, { ordered: false });
    console.log(`MongoDB 저장 완료: ${result.length}건`);
    return result;
  } finally {
    await mongoose.disconnect();
  }
}

// 마이프차 API 활용 - Raw 데이터 저장
const RawSchema = new mongoose.Schema({}, { strict: false });
const RawModel =
  mongoose.models.FranchiseRaw ||
  mongoose.model("FranchiseRaw", RawSchema, "franchise_raw");

async function saveToMongoFromApi(docs: any[]) {
  await connectMongoose();

  try {
    await RawModel.deleteMany({});
    const result = await RawModel.insertMany(docs, { ordered: false });
    console.log(`MongoDB 저장 완료: ${result.length}건`);
    return result;
  } finally {
    await mongoose.disconnect();
  }
}

// 프랜차이즈 데이터 조회
async function findAllFranchises() {
  await connectMongoose();
  try {
    return await FranchiseSchema.find({});
  } finally {
    await mongoose.disconnect();
  }
}

// 브랜드별 프랜차이즈 조회
async function findFranchisesByBrand(brandName: string) {
  await connectMongoose();
  try {
    return await FranchiseSchema.find({ brandName });
  } finally {
    await mongoose.disconnect();
  }
}

module.exports = { 
  saveToMongo, 
  saveToMongoFromApi, 
  findAllFranchises, 
  findFranchisesByBrand 
};
