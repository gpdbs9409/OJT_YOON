// 마이프차 API 활용
import mongoose from "mongoose";

export async function saveToMongoFromApi(apiData: any) {
  const collection = mongoose.connection.collection("api_data");
  await collection.insertMany(apiData.results);
}

export async function saveLatestVersionPk(latestVersionPk: any) {
  const collection = mongoose.connection.collection("latest_version_pk");
  await collection.insertOne({ latestVersionPk });
}
