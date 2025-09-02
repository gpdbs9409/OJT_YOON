import mongoose from "mongoose";
import * as dotenv from "dotenv"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();

// 서비스들 import
import { crawlSulbingAll } from "./services/sulbing_crawl.ts";
import { saveToMongo } from "./repository/save_to_mongo.ts";
import type { Branch } from "./repository/save_to_mongo.ts";

// 메인 실행 함수
async function main() {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string); // string으로 타입 캐스팅
    console.log("🚀 Mission1 프로그램 시작");
    console.log("📊 크롤링 시작...");

    // 설빙 크롤링
    console.log("🍧 설빙 크롤링 중...");
    const sulbingData = await crawlSulbingAll();
    console.log(`설빙 데이터 수집 완료: ${sulbingData.length}건`);
    await saveToMongo(sulbingData as Branch[], "sulbing");
    console.log("설빙 데이터 저장 완료");
    console.log("✅ 모든 작업 완료!");
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
