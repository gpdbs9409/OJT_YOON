import axios from "axios";
import {
  saveToMongoFromApi,
  saveLatestVersionPk,
} from "../repository/save_to_mongo";
const BASE_URL = "https://dev-fc-api.myfranchise.kr/api/v1/crawling";
const REG_NO = "20171254";
const VERSION = {
  LATEST: "60063",
  PREV: "58731",
};

const PAGE_SIZE = 100;
const HEADERS = { accept: "application/json" }; // URL builders
const latestUrl = () => `${BASE_URL}/${REG_NO}/latest/`;
const nextUrl = (versionPk: any) => `${BASE_URL}/${REG_NO}/${versionPk}/next/`;

//최신 Id 조회
async function fetchLatestVersionPk() {
  const { data } = await axios.get(latestUrl(), { headers: HEADERS });
  await saveLatestVersionPk(data.id);
  console.log("최신id저장완료");
  return data.id;
}

async function fetchAllStoreList() {
  // 1단계: 최신 버전 ID 가져오기
  const latestVersionId = await fetchLatestVersionPk();
  const baseUrl = `${BASE_URL}/${latestVersionId}/`;

  // 2단계: 첫 페이지 데이터 가져오기
  const { data } = await axios.get(baseUrl, { headers: HEADERS });
  saveToMongoFromApi(data);

  // 3단계: 페이지네이션 처리
  let currentUrl = `${baseUrl}?cursor=${data.next}&size=${PAGE_SIZE}`;
  let pageNumber = 1;
  let nextCursor = data.next;

  while (nextCursor) {
    pageNumber++;
    console.log(`페이지네이션 처리중: ${pageNumber}`);
    console.log(nextCursor);
    const { data: pageData } = await axios.get(currentUrl, {
      headers: HEADERS,
    });
    saveToMongoFromApi(pageData);

    nextCursor = pageData.next;
    currentUrl = `${baseUrl}?cursor=${nextCursor}&size=${PAGE_SIZE}`;
  }
}

export { fetchLatestVersionPk, fetchAllStoreList };
