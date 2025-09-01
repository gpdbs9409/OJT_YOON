// src/services/sulbing.ts

import axios from "axios";
import * as cheerio from "cheerio";
import { geocodeAddress } from "./naver_map_api.ts";

export type SulbingStore = {
  brandName: "설빙";
  branchName: string | undefined;
  address: string | undefined;
  location?: { type: "Point"; coordinates: [string, string] }; // [lng, lat]
  timestamp: string;
};

const BASE_URL = "https://sulbing.com/store/";
const REGIONS = [
  "서울특별시",
  "경기도",
  "인천광역시",
  "대전광역시",
  "대구광역시",
  "울산광역시",
  "전라남도",
  "전라북도",
  "충청남도",
  "충청북도",
  "제주특별자치도",
  "세종특별자치시",
  "광주광역시",
  "부산광역시",
  "경상남도",
  "경상북도",
  "강원도",
];

// 지역별로 돌면서 수집
async function crawlSulbingAll(): Promise<SulbingStore[]> {
  const all: SulbingStore[] = [];

  for (const region of REGIONS) {
    console.log(`설빙 ${region} 지역 크롤링 중...`);
    const url = `${BASE_URL}?addr1=${encodeURIComponent(
      region
    )}&addr2=&search=`;
    const { data: html } = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        Accept: "text/html,application/xhtml+xml",
      },
    });

    const $ = cheerio.load(html);
    const stores = $(".searchResult");

    for (let i = 0; i < stores.length; i++) {
      const el = stores[i];
      const $el = $(el);
      const $a = $el.find("a.storeName");

      const branchName =
        ($a.attr("storename") || $a.text() || "").trim() || undefined;
      const address =
        $el.find("span.address").first().text().trim() ||
        $a.attr("address")?.trim() ||
        undefined;

      if (!branchName || !address) {
        console.log("매장명 또는 주소가 없는 데이터 건너뛰기");
        continue;
      }

      try {
        const loc = await geocodeAddress(address as string);

        if (loc) {
          const location = {
            type: "Point" as const,
            coordinates: [loc.x, loc.y] as [string, string],
          };
          const timestamp = new Date().toLocaleString("ko-KR", {
            timeZone: "Asia/Seoul",
          });

          all.push({
            brandName: "설빙",
            branchName,
            address,
            location,
            timestamp,
          });
        } else {
          console.log(`주소 변환 실패 (${address}): 좌표를 찾을 수 없음`);
          // 주소 변환 실패해도 기본 데이터는 저장
          const timestamp = new Date().toISOString();
          all.push({ brandName: "설빙", branchName, address, timestamp });
        }
      } catch (error) {
        console.error(`주소 변환 실패 (${address}):`, error);
        // 주소 변환 실패해도 기본 데이터는 저장
        const timestamp = new Date().toISOString();
        all.push({ brandName: "설빙", branchName, address, timestamp });
      }
    }

    console.log(`${region} 지역 완료: ${stores.length}개 매장 처리`);
  }

  console.log(`총 ${all.length}개의 설빙 매장 데이터 수집 완료`);
  return all;
}

export { crawlSulbingAll };
