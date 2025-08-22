const mongoose = require("mongoose");
const { Schema } = mongoose;

const FranchiseSchema = new Schema(
  {
    name: { type: String, required: true },
    addr: { type: String, required: true },
    tel: { type: String, required: true },
    period: { type: String, default: "" },
  },
  { timestamps: true }
);

// 이미 선언돼 있으면 재사용
module.exports =
  mongoose.models.Franchise ||
  mongoose.model("Franchise", FranchiseSchema, "franchise_raw");
