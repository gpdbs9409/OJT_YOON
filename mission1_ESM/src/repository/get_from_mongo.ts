import mongoose from "mongoose";
import { branches } from "../model/branch.ts";
import type { Branch } from "../repository/save_to_mongo.ts";

// 10개 브랜치의 location 이름과 좌표 정보받아오기(기준점용)
export async function getLocationsFromMongo() {
  const collection = mongoose.connection.collection("sulbing");
  const branches = await collection.find().limit(10);
  const branchesArray = await branches.toArray();

  // 좌표 데이터가 있는 브랜치만 필터링
  const validBranches = branchesArray.filter((branch) => {
    return (
      branch.location &&
      branch.location.coordinates &&
      branch.location.coordinates.length === 2 &&
      typeof branch.location.coordinates[0] === "number" &&
      typeof branch.location.coordinates[1] === "number"
    );
  });

  const names = validBranches.map((branch) => branch.branchName);
  const locations = validBranches.map((branch) => branch.location);

  console.log(
    `📊 전체 브랜치: ${branchesArray.length}개, 유효한 좌표: ${validBranches.length}개`
  );

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

  // 유효한 좌표가 없으면 빈 배열 반환
  if (locations.locations.length === 0) {
    console.log("❌ 유효한 좌표 데이터가 없습니다.");
    return [];
  }

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

  // 유효한 좌표가 4개 미만이면 빈 배열 반환
  if (locations.locations.length < 4) {
    console.log(
      `❌ 다각형 생성에 필요한 최소 4개 좌표가 부족합니다. 현재: ${locations.locations.length}개`
    );
    return [];
  }

  console.log("📍 다각형 생성에 사용할 브랜치:", locations.names.slice(0, 4));

  // 좌표를 안전한 사각형으로 정렬
  const coordinates = locations.locations
    .slice(0, 4)
    .map((loc) => loc.coordinates);

  // 최소/최대 경도, 위도 찾기
  const lngs = coordinates.map((coord) => coord[0]);
  const lats = coordinates.map((coord) => coord[1]);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);

  // 사각형의 네 모서리 좌표 생성 (시계방향)
  const polygonCoordinates: [number, number][] = [
    [minLng, minLat], // 남서쪽
    [maxLng, minLat], // 남동쪽
    [maxLng, maxLat], // 북동쪽
    [minLng, maxLat], // 북서쪽
  ];

  // 사각형 닫기 (첫 번째 점으로 돌아가기)
  if (polygonCoordinates.length > 0) {
    polygonCoordinates.push(polygonCoordinates[0] as [number, number]);
  }

  console.log("🔍 생성된 다각형 좌표:", polygonCoordinates);

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
