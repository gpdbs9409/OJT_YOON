import mongoose from "mongoose";
import { branches } from "../model/branch"; // Branch schema 정의

type Branch = {
  brandName: string;
  branchName: string;
  address: string;
  location: { type: "Point"; coordinates: [string, string] };
  timestamp: string;
};

async function saveToMongo(data: Branch[], collectionname: string) {
  try {
    // mongoose 연결 확인
    if (mongoose.connection.readyState !== 1) {
      throw new Error("MongoDB 연결이 필요합니다.");
    }

    // db collection 선택
    const collection = mongoose.connection.collection(collectionname);

    // 만약 collection이 없으면 생성
    if (!collection) {
      await mongoose.connection.createCollection(collectionname);
    }
    await collection.deleteMany({});

    const validatedData = data.map((item: any) => {
      return new branches(item); // 스키마 검증
    });
    const result = await collection.insertMany(validatedData, {
      ordered: false,
    });
    console.log(`MongoDB 저장 완료: ${result.insertedCount}건`);
  } catch (error) {
    console.error("MongoDB 저장 중 오류 발생:", error);
    throw error;
  }
}

export { saveToMongo, type Branch };
