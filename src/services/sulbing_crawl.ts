// src/services/sulbing.ts

import axios = require("axios");
import cheerio = require("cheerio");
const { geocodeAddress } = require("./naver_map_api");
const Franchise = require("../models/branches_crawling");
const mongoose = require("mongoose");

export type SulbingStore = {
  brandName: "설빙";
  branchName: string | undefined;
  address: string | undefined;
  location?: { type: "Point"; coordinates: [number, number] }; // [lng, lat]
};

const BASE_URL = "https://sulbing.com/store/";
const REGIONS = [
  "서울특별시","경기도","인천광역시","대전광역시","대구광역시","울산광역시",
  "전라남도","전라북도","충청남도","충청북도","제주특별자치도",
  "세종특별자치시","광주광역시","부산광역시","경상남도","경상북도","강원도",
];

// 지역별로 돌면서 수집
async function crawlSulbingAll(): Promise<SulbingStore[]> {
  const all: SulbingStore[] = [];

  for (const region of REGIONS) {
    const url = `${BASE_URL}?addr1=${encodeURIComponent(region)}&addr2=&search=`;
    const { data: html } = await axios.get(url, {
      headers: { "User-Agent": "Mozilla/5.0", Accept: "text/html,application/xhtml+xml" },

    });

    const $ = cheerio.load(html);
    const before = all.length; // ← 이 지역에서 추가되기 전 길이

    $(".searchResult").each((_, el) => {
      const $el = $(el);
      const $a = $el.find("a.storeName");

      const branchName = ($a.attr("storename") || $a.text() || "").trim() || undefined;
      const address = $el.find("span.address").first().text().trim() || $a.attr("address")?.trim() || undefined;

      if (!branchName && !address) return;


      all.push({ brandName: "설빙", branchName, address });
    });

    // 이 지역에서 새로 추가된 것만 지오코딩 (address는 있다고 가정)
    for (let i = before; i < all.length; i++) {
      const store:any=all[i];
      const loc = await geocodeAddress(store.address as string);
      if (loc?.coordinates) {
        store.location = { type: "Point" as const, coordinates: loc.coordinates };
      }
    }
  }

  return all;
}

module.exports = { crawlSulbingAll };

/* 단독 실행
npx ts-node src/services/sulbing.ts
*/
if (require.main === module) {
  (async () => {
    const list = await crawlSulbingAll(); // 플래그 제거
    console.log("설빙 총 건수:", list.length);
    console.log(JSON.stringify(list.slice(0, 2)));
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error("MONGODB_URI 환경변수 없음");
    await mongoose.connect(uri);
    try {
      await Franchise.deleteMany({});
      await Franchise.insertMany(list, { ordered: false });
      console.log("Sulbing 저장 완료");
    } finally {
      await mongoose.disconnect();
    }
  });
}
