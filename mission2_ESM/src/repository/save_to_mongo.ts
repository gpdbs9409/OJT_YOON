// 마이프차 API 활용
import mongoose from "mongoose";
import { branch } from "../model/branch";

type Branch = {
  name: string;
  addr: string;
  tel: string;
  period: string;
  timestamp: Date | string;
};

export async function saveToMongoFromApi(apiData: { results: Branch[] }) {
  const collection = mongoose.connection.collection("api_data");

  //db초기화
  await collection.deleteMany({});

  // 스키마 검증 및 변환
  const validatedData = apiData.results.map((item: Branch) => {
    return new branch({
      ...item,
      timestamp: new Date().toLocaleString("ko-KR", {
        timeZone: "Asia/Seoul",
      }), // 서울 시간대 타임스탬프 추가
    }); // 스키마 검증
  });

  //데이터 insert
  await collection.insertMany(validatedData);
}

export async function saveLatestVersionPk(latestVersionPk: string) {
  const collection = mongoose.connection.collection("latest_version_pk");
  await collection.insertOne({ latestVersionPk });
}
