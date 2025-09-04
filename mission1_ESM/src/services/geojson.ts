// import {
//   getLocationsFromMongo,
//   findBranchesWithinRadius,
//   findBranchesWithinPolygon,
// } from "../repository/get_from_mongo.ts";
// import { branches } from "../model/branch.ts";

// // 2dsphere 인덱스 생성 함수
// async function createGeospatialIndex() {
//   try {
//     // branches 컬렉션에 2dsphere 인덱스 생성
//     await branches.collection.createIndex({ location: "2dsphere" });
//     console.log("✅ 2dsphere 인덱스 생성 완료");
//   } catch (error) {
//     console.log("ℹ️ 인덱스가 이미 존재하거나 생성 중 오류:", error);
//   }
// }

// // 다각형 내 검색 - repository 사용
// async function findWithinPolygon() {
//   // 2dsphere 인덱스 생성 확인
//   await createGeospatialIndex();
//   const locations = await getLocationsFromMongo();
//   if (locations.locations.length < 4) {
//     return [];
//   }

//   // 첫 번째 4개 브랜치의 좌표로 사각형 만들기
//   const firstFourLocations = locations.locations.slice(0, 4);
//   const rectangleCoordinates = firstFourLocations.map(
//     (location) => location.coordinates
//   );

//   // 사각형 닫기 (첫 번째 점으로 돌아가기) - 필수!
//   if (rectangleCoordinates.length > 0) {
//     rectangleCoordinates.push(rectangleCoordinates[0] as [number, number]);
//   }

//   // repository 함수 사용
//   const results = await findBranchesWithinPolygon(rectangleCoordinates);
//   return results;
// }

// export { findWithinPolygon };
