const express = require("express");
require("dotenv").config();
import mongoose from "mongoose";
const app = express();
const PORT = Number(process.env.PORT || 3000);
const {
  fetch_all_list_using_next,
  fetchstorelist,
} = require("./src/service/get_from_api");

// 서버 시작
async function startServer() {
  try {
    // MongoDB 연결
    mongoose.connect(process.env.MONGODB_URI as string);
    // 서버 시작
    app.listen(PORT, () => {
      console.log("🚀 서버가 시작되었습니다!");
      console.log(`📍 서버 주소: http://localhost:${PORT}`);
    });
    await fetch_all_list_using_next();
  } catch (error) {
    console.error("❌ 서버 시작 실패:", error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM 신호를 받았습니다. 서버를 종료합니다...");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("SIGINT 신호를 받았습니다. 서버를 종료합니다...");
  process.exit(0);
});

// 서버 시작
startServer();
