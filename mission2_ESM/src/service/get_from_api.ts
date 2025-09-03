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
import { getExistingVersionPk } from "../repository/get_from_mongo";
const PAGE_SIZE = 100;
const HEADERS = { accept: "application/json" }; // URL builders

const GetnextVersionPk = async () => {
  const existingVersionPk = await getExistingVersionPk();
  const url = `${BASE_URL}/${REG_NO}/${existingVersionPk}/next/`;
  console.log("Next API 요청 URL:", url); // URL 확인
  try {
    const { data } = await axios.get(url, { headers: HEADERS });
    console.log("Next API 응답:", data); // 응답 확인
    return data.id; //현재 버전에서 nextapi 이용해서 다음 버전의 id 가져옴
  } catch (error: any) {
    return null; // 에러 시 null 반환
  }
};

//최신 Id 조회
async function fetchLatestVersionPk() {
  const url = `${BASE_URL}/${REG_NO}/latest/`; // 최신 버전 조회 엔드포인트
  console.log("요청 URL:", url); // URL 확인
  const { data } = await axios.get(url, { headers: HEADERS });
  console.log("API 응답 데이터:", data); // 전체 응답 확인
  console.log("data.latestVersionPk:", data.latestVersionPk); // 특정 필드 확인
  console.log("data.id:", data.id); // 다른 가능한 필드 확인
  console.log("data.version:", data.version); // 다른 가능한 필드 확인
  await saveLatestVersionPk(data.latestVersionPk);
  console.log("최신id저장완료");
  return data.latestVersionPk;
}

async function fetchAllStoreList(versionId: string) {
  // 1단계: 최신 버전 ID 가져오기
  const baseUrl = `${BASE_URL}/${versionId}/`;
  let pageNumber = 0;
  let currentUrl = baseUrl;
  let nextCursor: string | null = null;

  do {
    pageNumber++;
    console.log(`페이지네이션 처리중: ${pageNumber}`);

    const { data } = await axios.get(currentUrl, {
      headers: HEADERS,
    });

    await saveToMongoFromApi(data);

    nextCursor = data.next;
    currentUrl = `${baseUrl}?cursor=${nextCursor}&size=${PAGE_SIZE}`;
  } while (nextCursor);
}

export { fetchLatestVersionPk, fetchAllStoreList, GetnextVersionPk };
