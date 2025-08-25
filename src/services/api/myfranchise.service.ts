const axios = require('axios');
const { saveToMongoFromApi } = require('../../repository/franchise');
const { HeadersGenerator } = require('../../utils/headers');

const BASE_URL = "https://dev-fc-api.myfranchise.kr/api/v1/crawling";
const REG_NO = "20171254";
const VERSION = {
  LATEST: "60063",
  PREV: "58731",
};

const PAGE_SIZE = 100;
const HEADERS = { accept: "application/json" };

// URL builders
const latestUrl = () => `${BASE_URL}/${REG_NO}/latest/`;
const listUrl = (versionPk: string, cursor = "", size = PAGE_SIZE) =>
  `${BASE_URL}/${versionPk}/?size=${size}${cursor ? `&cursor=${cursor}` : ""}`;
const nextUrl = (versionPk: string) => `${BASE_URL}/${REG_NO}/${versionPk}/next/`;

class MyFranchiseService {
  /**
   * 최신 버전 조회: /{registrationNumber}/latest/
   */
  static async fetchLatestVersionPk() {
    try {
      const HEADERS = { accept: "application/json" }; 
      const { data } = await axios.get(latestUrl(), { headers: HEADERS });
      
      const v =
        data?.version_pk ?? // 어떤 환경에선 이 키일 수도
        data?.id ?? // 실제로는 이 키(id)가 내려옴
        data?.latest_version_pk ??
        data?.latest?.version_pk ??
        data?.latest?.id;

      if (!v) {
        throw new Error(
          `latest 응답에 버전 키 없음: ${JSON.stringify(data).slice(0, 300)}`
        );
      }
      return String(v);
    } catch (error) {
      console.error('최신 버전 조회 실패:', error);
      throw error;
    }
  }

  /**
   * 리스트 페이지네이션: /{version_pk}/?size=&cursor=
   */
  static async fetchAllStores(versionPk: string) {
    try {
      let cursor = "";
      const all = [];
      
      while (true) {
        const { data } = await axios.get(listUrl(versionPk, cursor), {
          headers: HEADERS,
        });
        
        const results = Array.isArray(data?.results) ? data.results : [];
        console.log(
          `이번 페이지 개수: ${results.length}, next_cursor: ${
            data?.next_cursor || ""
          }`
        );
        
        all.push(...results);
        cursor = data?.next_cursor || "";
        
        if (!cursor) break;
      }
      
      return all;
    } catch (error) {
      console.error('가맹점 목록 조회 실패:', error);
      throw error;
    }
  }

  /**
   * 전체 프로세스: 최신 버전 → 전체 수집 → 저장
   */
  static async collectAndSaveAllStores() {
    try {
      const versionPk = await this.fetchLatestVersionPk();
      const allStores = await this.fetchAllStores(versionPk);
      console.log("총 가맹점 수:", allStores.length);
      await saveToMongoFromApi(allStores);
      console.log("✅ 가맹점 정보 저장 완료");
    } catch (error) {
      console.error("❌ 가맹점 정보 수집/저장 실패:", error);
      throw error;
    }
  }
}

// 직접 실행 시
if (require.main === module) {
  MyFranchiseService.collectAndSaveAllStores()
    .then(() => {
      console.log("프로세스 완료");
      process.exit(0);
    })
    .catch((error) => {
      console.error("프로세스 실패:", error);
      process.exit(1);
    });
}

module.exports = { MyFranchiseService };

