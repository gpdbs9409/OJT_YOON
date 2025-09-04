import mongoose from "mongoose";
import * as dotenv from "dotenv"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();

// 서비스들 import
import { crawlSulbingAll } from "./services/sulbing_crawl.ts";
import { saveToMongo } from "./repository/save_to_mongo.ts";
import type { Branch } from "./repository/save_to_mongo.ts";

import {
  findBranchesWithinRadius,
  findBranchesWithinPolygon,
  getLocationsFromMongo,
} from "./repository/get_from_mongo.ts";
// 메인 실행 함수
async function main() {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string, {
      autoCreate: true, // 컬렉션이 없을 때 자동 생성
    }); // string으로 타입 캐스팅
    console.log("🚀 Mission1 프로그램 시작");
    console.log("📊 크롤링 시작...");

    // 설빙 크롤링

    // console.log("🍧 설빙 크롤링 중...");
    // const sulbingData = await crawlSulbingAll();
    // console.log(`설빙 데이터 수집 완료: ${sulbingData.length}건`);
    // await saveToMongo(sulbingData as Branch[], "sulbing");
    // console.log("설빙 데이터 저장 완료");

    console.log("🔍 MongoDB 지리공간 쿼리 테스트 시작...");

    // 1. 반경 내 검색 테스트 (DB에서 받아온 첫 번째 location 기준 10km 반경에 있는지)
    console.log(
      "\n2️⃣ db상 첫번째 설빙 위치로부터 다른 매장들이 10km 반경에 있는지 테스트"
    );
    const locations = await getLocationsFromMongo();
    const firstLocation = locations.names[0];
    console.log("첫번째 설빙 매장명:", firstLocation);

    const radiusResults = await findBranchesWithinRadius(10000);

    if (radiusResults.length > 0) {
      console.log("존재 갯수:", radiusResults.length);
      console.log("First result:", radiusResults[0]?.branchName);
    } else {
      console.log("10km 반경에 매장이 없습니다.");
    }

    //3.다각형 쿼리:설빙 매장 네개 좌표를 받아,해당 사각형 내 다른 설빙매장 위치하는지 테스트
    console.log(
      "\n3️⃣ 다각형 쿼리:선택한 사각형 내 다른 설빙매장 위치하는지 테스트"
    );
    const polygonResults = await findBranchesWithinPolygon();
    if (polygonResults.length > 0) {
      console.log("존재 갯수:", polygonResults.length);
      console.log("First result:", polygonResults[0]?.branchName);
    } else {
      console.log("사각형 내에 매장이 없습니다.");
    }

    console.log("\n✅ 모든 테스트 완료!");
  } catch (error) {
    console.error("❌ 프로그램 실행 중 오류 발생:", error);
    process.exit(1);
  } finally {
    // MongoDB 연결 종료
    await mongoose.disconnect();
    console.log("🔌 MongoDB 연결 종료");
  }
}

// 직접 실행 시에만 main 함수 실행
main();

export { main };
