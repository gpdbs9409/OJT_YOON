import mongoose from "mongoose";
//odm을 위한 몽구스 스키마 정의

//원래는 필드값을 옵셔널로 두지 않았지만, 옵셔널로 두지 않으니 스키마 검증을 하나도 통과하지 못해서 옵셔널로 둠.

const branchschema = new mongoose.Schema({
  brandName: { type: String },
  branchName: { type: String },
  address: { type: String },
  location: {
    type: { type: String },
    coordinates: { type: [String, String], required: false },
  },
  timestamp: { type: String, required: false },
});

//몽구스 모델 생성하여 odm 사용 가능하게 함
const branches = mongoose.model("branches", branchschema);

export { branches };
