const mongoose = require("mongoose");
const { Schema } = mongoose;
const FranchiseSchema = new Schema(
  {
    brandName: { type: String, required: true },
    branchName: { type: String, required: true },
    address: { type: String, required: true },
    phone: String,
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        // [lng, lat] (WGS84)
        type: [Number],
        required: true,
      },
    },
  },
  { timestamps: true }
);

FranchiseSchema.index({ location: "2dsphere" });

// TypeScript 타입 정의 (CommonJS에서는 export type 대신 주석으로 처리)
// type FranchiseDoc = mongoose.InferSchemaType<typeof FranchiseSchema>;

module.exports = mongoose.model("Franchise", FranchiseSchema);
