const { MongoClient } = require("mongodb");

let _client: any = null;

async function getDb() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI가 .env에 없습니다.");
  if (!_client) {
    _client = new MongoClient(uri);
    await _client.connect();
    console.log("✅ MongoDB connected");
  }
  return _client.db(process.env.MONGO_DB || "myfranchise");
}

module.exports = { getDb };

