// 마이프차 API 활용
import mongoose from "mongoose";
import { branch, latest_version_pk } from "../model/branch";

type Branch = {
  name: string;
  addr: string;
  tel: string;
  period: string;
};

export async function saveToMongoFromApi(apiData: { results: Branch[] }) {
  const collection = mongoose.connection.collection("api_data");

  // 스키마 검증 및 변환
  const validatedData = apiData.results.map((item: Branch) => {
    return new branch(item); // 스키마 검증
  });

  //데이터 insert (누적 저장)
  await collection.insertMany(validatedData);
}

export async function saveLatestVersionPk(latestVersionPk: string) {
  const collection = mongoose.connection.collection("latest_version_pk");

  // 기존 문서가 있는지 확인하고 업데이트, 없으면 새로 생성
  const result = await collection.updateOne(
    {}, // 모든 문서에 대해 (보통 하나의 문서만 존재)
    { $set: { latestVersionPk } },
    { upsert: true } // 문서가 없으면 새로 생성
  );

  console.log("latestkey로 db업데이트 완료", latestVersionPk);
}
