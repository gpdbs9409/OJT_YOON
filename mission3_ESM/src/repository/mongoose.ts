import mongoose from "mongoose";

//마이프차 api 데이터 몽구스 스키마 정의
const api_data_schema = new mongoose.Schema({
  data: {
    id: String,
    name: String,
    addr: String,
    tel: String,
    period: String,
  },
});

const api_data = mongoose.model("api_data", api_data_schema, "api_data");

export { api_data };
