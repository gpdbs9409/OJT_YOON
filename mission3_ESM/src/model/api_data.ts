import mongoose from "mongoose";

//마이프차 api 데이터 몽구스 스키마 정의, create와 update에서 사용
const api_data_schema = new mongoose.Schema({
  name: String,
  addr: String,
  tel: String,
  period: String,
});

const api_data = mongoose.model("api_data", api_data_schema, "api_data"); //모델이름,스키마객체,실제 컬렉션이름

export { api_data };
