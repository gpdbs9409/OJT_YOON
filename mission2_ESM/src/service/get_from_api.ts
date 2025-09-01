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

  console.log("최신id:", data.id);
  console.log("최신버전 저장완료");

  return data.id;
}

// 2.가맹점 리스트 api 조회 > 단일 버전 (3번함수가 젤 중요하고 이건 참고용)
async function fetchstorelist() {
  const latesVersionId = await fetchLatestVersionPk();
  const latestUrl = `${BASE_URL}/${latesVersionId}/`;
  const { data } = await axios.get(latestUrl, { headers: HEADERS });
  console.log("data.results.length:", data.results.length);
  console.log("data.results[0]:", data.results[0]);

  let nextKey = data.next;
  console.log("nextKey:", nextKey);
  let paginationUrlorigin = `${latestUrl}`;
  let paginationUrl = `${latestUrl}?cursor=${nextKey}&size=${PAGE_SIZE}`;
  console.log("paginationUrl:", paginationUrl);

  return { paginationUrl, latestUrl, nextKey, paginationUrlorigin };
}

//3. nextUrl 이용해서 페이지네이션 처리 하고 데이터 저장
async function fetch_all_list_using_next() {
  //cursor=next 이용해서 페이지네이션 처리
  const storeListResult = await fetchstorelist();
  const baseUrl = storeListResult.paginationUrlorigin;
  let currentUrl = storeListResult.paginationUrl;
  let pagenumber = 0;

  while (currentUrl) {
    pagenumber++;
    console.log("페이지네이션 처리중:", pagenumber);
    const { data } = await axios.get(currentUrl, { headers: HEADERS });
    saveToMongoFromApi(data);
    // console.log("data:", data.results[0]);
    let nextkey = data.next;
    console.log("현재 nextkey:", nextkey, typeof nextkey);
    console.log("currenttime:", new Date());
    if (typeof nextkey !== "string") {
      console.log("end of iteration");
      break;
    }
    currentUrl = `${baseUrl}?cursor=${nextkey}&size=${PAGE_SIZE}`;
  }
}

//

export { fetchLatestVersionPk, fetchstorelist, fetch_all_list_using_next };
