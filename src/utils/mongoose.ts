import mongoose = require("mongoose");

let isReady = false;

async function connectMongoose() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI가 .env에 없습니다.");

  if (!isReady) {
    await mongoose.connect(uri); // URI에 DB 포함 가정
    isReady = true;

    mongoose.connection.on("error", (e: unknown) => {
      // 로그 시 안전하게 처리
      if (e instanceof Error) {
        console.error("[mongoose]", e.message, e.stack);
      } else {
        console.error("[mongoose]", e);
      }
    });

    console.log("✅ Mongoose connected");
  }
  return mongoose.connection;
}

module.exports = { connectMongoose };
