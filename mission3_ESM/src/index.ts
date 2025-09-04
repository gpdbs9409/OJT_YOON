import express from "express";
import dotenv from "dotenv";
import franchiseRoutes from "./routes/franchise.routes";
import swaggerUi from "swagger-ui-express";
import { createSwaggerSpec } from "./utils/swagger";
import mongoose from "mongoose";
dotenv.config();
const app = express();
app.use(express.json()); //json 형식으로 데이터를 받기 위한 미들웨어

// Swagger setup
const swaggerSpec = createSwaggerSpec(3003); //swagger spec 3003 포트로 생성

// 서버에 라우팅 등록
app.use("/api/v1/franchises", franchiseRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

async function startServer() {
  try {
    mongoose.connect(process.env.MONGODB_URI as string);
    app.listen(3003, () => {
      console.log("🚀 서버가 시작되었습니다!");
      console.log(`swagger UI: http://localhost:3003/api-docs`);
      console.log("connected to mongodb");
    });
  } catch (error) {
    console.error("❌ 서버 시작 실패:", error);
    process.exit(1);
  }
  process.on("SIGINT", async () => {
    await mongoose.disconnect();
    console.log("�� MongoDB 연결 종료");
    process.exit(0);
  });
}

startServer();
