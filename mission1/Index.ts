require("dotenv").config();
import mongoose = require("mongoose"); //commonjs  import

// 서비스들 import
const { crawlMisoyaAll } = require("./src/services/misoya_crawl");
const { crawlSulbingAll } = require("./src/services/sulbing_crawl");
const { saveToMongo } = require("./src/repository/save_to_mongo");

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
    await saveToMongo(sulbingData, "sulbing");
    console.log("설빙 데이터 저장 완료");
    // 미소야 크롤링
    // console.log("🍜 미소야 크롤링 중...");
    // const misoyaData = await crawlMisoyaAll();
    // console.log(`미소야 데이터 수집 완료: ${misoyaData.length}건`);
    // await saveToMongo(misoyaData, "misoya");
    // console.log("미소야 데이터 저장 완료");
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
if (require.main === module) {
  main();
}

module.exports = { main };
