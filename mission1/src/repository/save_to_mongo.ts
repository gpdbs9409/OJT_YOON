import mongoose = require("mongoose");
import { branches } from "../model/mongoose";

// Branch type 정의
type Branch = {
  id: string;
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

    // 기존 컬렉션 데이터의 id 추출
    const existingDataIds = await collection
      .find({}, { projection: { "data.id": 1 } })
      .toArray();
    const existingIds = existingDataIds
      .map((item) => item.data?.id)
      .filter(Boolean);

    // 새로 들어올 데이터의 id 추출
    const newDataIds = data.map((item) => item.id);

    // 새 데이터에 없는 기존 데이터 삭제
    const idsToDelete = existingIds.filter((id) => !newDataIds.includes(id));
    if (idsToDelete.length > 0) {
      await collection.deleteMany({ "data.id": { $in: idsToDelete } });
      console.log(`삭제된 데이터: ${idsToDelete.length}건`);
    }

    // 기존 데이터에 없는 새 데이터만 추가
    const idsToAdd = newDataIds.filter((id) => !existingIds.includes(id));
    const dataToAdd = data.filter((item) => idsToAdd.includes(item.id));

    if (dataToAdd.length > 0) {
      // mongoose 스키마에 맞게 데이터 구조 변환
      const formattedData = dataToAdd.map((item) => ({
        data: {
          id: item.id,
          brandName: item.brandName,
          branchName: item.branchName,
          address: item.address,
          location: item.location,
          timestamp: item.timestamp,
        },
      }));

      const result = await collection.insertMany(formattedData, {
        ordered: false,
      });
      console.log(`MongoDB 저장 완료: ${result.insertedCount}건`);
    } else {
      console.log("추가할 새로운 데이터가 없습니다.");
    }
  } catch (error) {
    console.error("MongoDB 저장 중 오류 발생:", error);
    throw error;
  }
}

export { saveToMongo, Branch };
