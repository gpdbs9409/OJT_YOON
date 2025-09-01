import * as dotenv from "dotenv";
dotenv.config();
import express, { Express } from "express";
import mongoose from "mongoose";
import { dailydataupdate } from "./service/daily_scheduler";

const app: Express = express();
const PORT = Number(process.env.PORT || 3000);

// 서버 시작
async function startServer() {
  try {
    // MongoDB 연결
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log("✅ MongoDB 연결 성공");

    // 서버 시작
    app.listen(PORT, () => {
      console.log("🚀 서버가 시작되었습니다!");
      console.log(`📍 서버 주소: http://localhost:${PORT}`);
      console.log("⏰ 스케줄러가 매분마다 실행됩니다 (테스트 모드)");
    });

    // 초기 데이터 업데이트 실행
    await dailydataupdate();
  } catch (error) {
    console.error("❌ 서버 시작 실패:", error);
    process.exit(1);
  }
}

// 서버 시작
startServer();
