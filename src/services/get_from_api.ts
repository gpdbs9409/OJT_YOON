require("dotenv").config();  // 👈 맨 위에 추가



const axios = require("axios");
const { saveToMongoFromApi } = require("./save_to_mongo");



const BASE_URL = "https://dev-fc-api.myfranchise.kr/api/v1/crawling";
const REG_NO = "20171254";
const VERSION = {
  LATEST: "60063",
  PREV: "58731",
};

const PAGE_SIZE = 100;
const HEADERS = { accept: "application/json" };// URL builders
const latestUrl = () => `${BASE_URL}/${REG_NO}/latest/`;
const listUrl = (versionPk:any  , cursor = "", size = PAGE_SIZE) =>
  `${BASE_URL}/${versionPk}/?size=${size}${cursor ? `&cursor=${cursor}` : ""}`;
const nextUrl = (versionPk :any ) => `${BASE_URL}/${REG_NO}/${versionPk}/next/`;

// 1) 최신 버전 조회: /{registrationNumber}/latest/
async function fetchLatestVersionPk() {
  const { data } = await axios.get(latestUrl(), { headers: HEADERS });

  const v =
    data?.version_pk ??         // 어떤 환경에선 이 키일 수도
    data?.id ??                 // 실제로는 이 키(id)가 내려옴
    data?.latest_version_pk ??
    data?.latest?.version_pk ??
    data?.latest?.id;

  if (!v) {
    throw new Error(
      `latest 응답에 버전 키 없음: ${JSON.stringify(data).slice(0, 300)}`
    );
  }
  return String(v);
}

// 2) 리스트 페이지네이션: /{version_pk}/?size=&cursor=
async function fetchAllStores(versionPk:any ) {
  let cursor = "";
  const all = [];
  while (true) {
    const { data } = await axios.get(listUrl(versionPk, cursor), {
      headers: HEADERS,
    });
    const results = Array.isArray(data?.results) ? data.results : [];
    console.log(
      `이번 페이지 개수: ${results.length}, next_cursor: ${data?.next_cursor || ""}`
    );
    all.push(...results);
    cursor = data?.next_cursor || "";
    if (!cursor) break;
  }
  return all;
}

// (옵션) 3) 다음 버전 확인: /{registration_number}/{version_pk}/next/
async function fetchNextVersionPk(currentPk:any){
  const { data } = await axios.get(nextUrl(currentPk), { headers: HEADERS });
  return data?.version_pk || data?.next_version_pk || null;
}

// 직접 실행 시: 최신 버전 → 전체 수집 → 저장
if (require.main === module) {
  (async () => {
    try {
      const versionPk = await fetchLatestVersionPk();
      const allStores = await fetchAllStores(versionPk);
      console.log("총 가맹점 수:", allStores.length);
      await saveToMongoFromApi(allStores);
    } catch (e) {
      console.error(e);
      process.exit(1);
    }
  })();
}

module.exports = { fetchLatestVersionPk, fetchAllStores, fetchNextVersionPk };
