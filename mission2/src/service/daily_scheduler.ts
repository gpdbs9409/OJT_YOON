//매일 오전 12시 정각에 실행되는 스케줄러
//latest_version_pk 와 next_version_pk를 비교해서 다르면 새로운 데이터를 받아서 저장
const schedule = require("node-schedule");
const mongoose = require("mongoose");
const {
  fetchLatestVersionPk,
  fetch_all_list_using_next,
} = require("./get_from_api");

async function getExistingVersionPk() {
  const existingVersionPk = await mongoose.connection
    .collection("latest_version_pk")
    .findOne({});
  return existingVersionPk;
}

async function updateLatestVersionPk(latestVersionPk: string) {
  await mongoose.connection
    .collection("latest_version_pk")
    .updateOne({}, { latestVersionPk });
}

//latest_version_pk 와 existingVersionPk 비교해서 다르면 새로운 데이터를 받아서 저장하고 pk update 하기.
async function dailydataupdate() {
  const existingVersionPk = await getExistingVersionPk();
  const latestVersionPk = await fetchLatestVersionPk();

  if (latestVersionPk !== existingVersionPk) {
    const exisitingLatestVersionPk = latestVersionPk;
    updateLatestVersionPk(exisitingLatestVersionPk);
    console.log("updateLatestVersionPk");
    await fetch_all_list_using_next(exisitingLatestVersionPk);
  }
}

schedule.scheduleJob("0 0 * * *", dailydataupdate); //매일 오전 12시 정각에 실행

module.exports = { dailydataupdate };
