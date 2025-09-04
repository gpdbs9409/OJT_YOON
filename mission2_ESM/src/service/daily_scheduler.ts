//매분 실행되는 스케줄러
//latest_version_pk 와 next_version_pk를 비교해서 다르면 새로운 데이터를 받아서 저장
import schedule from "node-schedule";
import {
  fetchLatestVersionPk,
  fetchAllStoreList,
  GetnextVersionPk,
} from "./get_from_api";
import { saveLatestVersionPk } from "../repository/save_to_mongo";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
dotenv.config();
//latest_version_pk 와 existingVersionPk 비교해서 다르면 새로운 데이터를 받아서 저장하고 pk update 하기.
async function dailydataupdate() {
  console.log(`🔄 스케줄러 실행: ${new Date().toLocaleString("ko-KR")}`);
  const nextversionkey = await GetnextVersionPk();
  if (nextversionkey) {
    //nextversionkey가 있을때만 새로운 데이터를 받아서 저장하고 latestVersionkeyupdate 하기.
    mongoose.connect(process.env.MONGODB_URI as string, {
      autoCreate: true, // 컬렉션이 없을 때 자동 생성
    });
    console.log("✅ MongoDB 연결 성공");

    await fetchAllStoreList(nextversionkey);
    await saveLatestVersionPk(nextversionkey); // latestVersionPk 업데이트
    console.log("✅ 새로운 데이터를 받아서 저장했습니다.");
    mongoose.disconnect();
  } else {
    console.log("✅ 새로운 데이터가 없습니다.");
  }
}

schedule.scheduleJob("* * * * *", dailydataupdate); //매분마다 실행 (테스트용)

export { dailydataupdate };
