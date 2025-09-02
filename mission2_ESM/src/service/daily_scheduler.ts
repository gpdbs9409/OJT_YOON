//매분 실행되는 스케줄러
//latest_version_pk 와 next_version_pk를 비교해서 다르면 새로운 데이터를 받아서 저장
import schedule from "node-schedule";
import mongoose from "mongoose";
import { fetchLatestVersionPk, fetchAllStoreList } from "./get_from_api";

async function getExistingVersionPk() {
  const existingVersionPk = await mongoose.connection
    .collection("latest_version_pk")
    .findOne({});
  return existingVersionPk?.latestVersionPk;
}

//latest_version_pk 와 existingVersionPk 비교해서 다르면 새로운 데이터를 받아서 저장하고 pk update 하기.
async function dailydataupdate() {
  console.log(`🔄 스케줄러 실행: ${new Date().toLocaleString("ko-KR")}`);

  const existingVersionPk = await getExistingVersionPk();
  const latestVersionPk = await fetchLatestVersionPk();

  if (latestVersionPk !== existingVersionPk) {
    await fetchAllStoreList();
  } else {
    console.log("✅ 새로운 데이터가 없습니다.");
  }
}

schedule.scheduleJob("* * * * *", dailydataupdate); //매분마다 실행 (테스트용)

export { dailydataupdate };
