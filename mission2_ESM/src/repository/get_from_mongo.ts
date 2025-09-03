import mongoose from "mongoose";

async function getExistingVersionPk() {
  const existingVersionPk = await mongoose.connection
    .collection("latest_version_pk")
    .findOne({});
  console.log("existingVersionPk", existingVersionPk?.latestVersionPk);
  return existingVersionPk?.latestVersionPk; // 기본값 설정
}

export { getExistingVersionPk };
