import mongoose from "mongoose";
//odm을 위한 몽구스 스키마 정의
const branchschema = new mongoose.Schema({
  data: {
    id: String,
    brandName: String,
    branchName: String,
    address: String,
    location: {
      coordinates: [Number, Number],
      type: String,
    },
    timestamp: String,
  },
});
//id 필드 인덱스 생성
branchschema.path("id");

//몽구스 모델 생성하여 odm 사용 가능하게 함
const branches = mongoose.model("branches", branchschema);

export { branches };
