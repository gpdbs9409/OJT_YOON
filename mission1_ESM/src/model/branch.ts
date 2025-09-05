import mongoose from "mongoose";
//odm을 위한 몽구스 스키마 정의

const branchschema = new mongoose.Schema(
  {
    brandName: { type: String },
    branchName: { type: String },
    address: { type: String },
    location: {
      type: { type: String, enum: ["Point"] }, //enum으로 타입 제한
      coordinates: { type: [Number], required: false }, //geolocation 이 없는 경우 스키마 검증을 통과하지 못해서 옵셔널로 둠.
    },
  },
  { timestamps: true }
);

//몽구스 모델 생성하여 odm 사용 가능하게 함
const branches = mongoose.model("branches", branchschema);

export { branches };
