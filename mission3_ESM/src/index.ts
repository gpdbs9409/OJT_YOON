import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import franchiseRoutes from "./routes/franchise.routes";
import swaggerUi from "swagger-ui-express";
import { createSwaggerSpec } from "./utils/swagger";

dotenv.config();
const app = express();

// Middleware
app.use(express.json());

// Swagger setup
const swaggerSpec = createSwaggerSpec(3003);

// Routes
app.use("/api/v1/franchises", franchiseRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

async function startServer() {
  try {
    app.listen(3003, () => {
      console.log("🚀 서버가 시작되었습니다!");
      console.log(`swagger UI: http://localhost:3003/api-docs`);

      mongoose.connect(process.env.MONGODB_URI as string);
      console.log("connected to mongodb");
    });
  } catch (error) {
    console.error("❌ 서버 시작 실패:", error);
    process.exit(1);
  }
}

startServer();
