import mongoose from "mongoose";
import { branches } from "../model/branch.ts";
import type { Branch } from "../repository/save_to_mongo.ts";

// 10개 브랜치의 location 정보받아오기(기준점용)
export async function getLocationsFromMongo() {
  const collection = mongoose.connection.collection("sulbing");
  const branches = await collection.find().limit(10);
  const branchesArray = await branches.toArray();
  const names = branchesArray.map((branch) => branch.branchName);
  const locations = branchesArray.map((branch) => branch.location);
  return { names, locations } as {
    names: string[];
    locations: { type: "Point"; coordinates: [number, number] }[];
  };
}

// 반경 내 검색 - MongoDB 쿼리로 기준점 기준  반경 내 설빙매장 찾기
export async function findBranchesWithinRadius(radiusInMeters: number) {
  const collection = mongoose.connection.collection("sulbing");

  // 2dsphere 인덱스 생성
  try {
    await collection.createIndex({ location: "2dsphere" });
    console.log("✅ sulbing 컬렉션에 2dsphere 인덱스 생성 완료");
  } catch (error) {
    console.log("ℹ️ 인덱스가 이미 존재하거나 생성 중 오류:", error);
  }

  const locations = await getLocationsFromMongo();
  const centerLng = locations.locations[0]?.coordinates[0];
  const centerLat = locations.locations[0]?.coordinates[1];

  const results = await collection
    .find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [centerLng, centerLat] as [number, number],
          },
          $maxDistance: radiusInMeters,
        },
      },
    })
    .toArray();
  return results;
}

// 다각형 내 검색 - MongoDB 쿼리
export async function findBranchesWithinPolygon() {
  const collection = mongoose.connection.collection("sulbing");
  const locations = await getLocationsFromMongo();

  if (locations.locations.length < 4) {
    return [];
  }
  console.log("locations.brandname", locations.names.slice(0, 4));
  const polygonCoordinates = locations.locations
    .slice(0, 4)
    .map((loc) => loc.coordinates);

  // 사각형 닫기 (첫 번째 점으로 돌아가기)
  if (polygonCoordinates.length > 0) {
    polygonCoordinates.push(polygonCoordinates[0] as [number, number]);
  }

  // 2dsphere 인덱스 생성
  try {
    await collection.createIndex({ location: "2dsphere" });
    console.log("✅ sulbing 컬렉션에 2dsphere 인덱스 생성 완료");
  } catch (error) {
    console.log("ℹ️ 인덱스가 이미 존재하거나 생성 중 오류:", error);
  }

  const results = await collection
    .find({
      location: {
        $geoWithin: {
          $geometry: {
            type: "Polygon",
            coordinates: [polygonCoordinates],
          },
        },
      },
    })
    .toArray();
  return results;
}
