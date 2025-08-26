require("dotenv").config();

const mongoose = require("mongoose");
const { connectMongoose } = require("../config/database");

// 설빙/미소야 크롤링 모델 저장
async function saveToMongo(docs: any[], collectionName: string = "franchise_crawled") {
  await connectMongoose();
  
  // 동적으로 모델 생성
  const CrawlSchema = new mongoose.Schema({}, { strict: false });
  const CrawlModel = mongoose.models[collectionName] || 
                     mongoose.model(collectionName, CrawlSchema, collectionName);
  
  await CrawlModel.deleteMany({});
  try {
    // 스키마 검증됨 (누락되면 ValidationError)
    const result = await CrawlModel.insertMany(docs, { ordered: false });
    console.log(`MongoDB 저장 완료: ${result.length}건 (컬렉션: ${collectionName})`);
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

module.exports = { 
  saveToMongo, 
  saveToMongoFromApi, 
};
