// src/services/crawling/sulbing-crawling.service.ts

const axios = require("axios");
const cheerio = require("cheerio");
const { NaverGeocodingService } = require('../geocoding/naver-geocoding.service');
const Franchise = require("../../models/branches_crawling");
const mongoose = require("mongoose");

const SulbingStore = {
  brandName: "설빙",
  branchName: String,
  address: String,
  location: { type: "Point", coordinates: [Number, Number] } // [lng, lat]
};

const BASE_URL = "https://sulbing.com/store/";
const REGIONS = [
  "서울특별시","경기도","인천광역시","대전광역시","대구광역시","울산광역시",
  "전라남도","전라북도","충청남도","충청북도","제주특별자치도",
  "세종특별자치시","광주광역시","부산광역시","경상남도","경상북도","강원도",
];

// 지역별로 돌면서 수집
async function crawlSulbingAll() {
  const all: any[] = [];

  for (const region of REGIONS) {
    console.log(`📍 ${region} 매장 수집 중...`);
    const url = `${BASE_URL}?addr1=${encodeURIComponent(region)}&addr2=&search=`;
    
    try {
      const { data: html } = await axios.get(url, {
        headers: { 
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36", 
          Accept: "text/html,application/xhtml+xml" 
        },
        timeout: 10000
      });

      const $ = cheerio.load(html);
      const before = all.length; // ← 이 지역에서 추가되기 전 길이

      $(".searchResult").each((_: any, el: any) => {
        const $el = $(el);
        const $a = $el.find("a.storeName");

        const branchName = ($a.attr("storename") || $a.text() || "").trim() || undefined;
        const address = $el.find("span.address").first().text().trim() || $a.attr("address")?.trim() || undefined;

        if (!branchName && !address) return;

        all.push({ brandName: "설빙", branchName, address });
      });

      console.log(`✅ ${region}: ${all.length - before}개 매장 수집됨`);

      // 이 지역에서 새로 추가된 것만 지오코딩 (address는 있다고 가정)
      for (let i = before; i < all.length; i++) {
        const store = all[i];
        if (store.address) {
          try {
            const loc = await NaverGeocodingService.geocodeAddress(store.address);
            if (loc?.coordinates) {
              store.location = { type: "Point", coordinates: loc.coordinates };
              console.log(`🧭 ${store.branchName}: [${loc.coordinates[0]}, ${loc.coordinates[1]}]`);
            }
          } catch (err) {
            console.warn(`⚠️ 지오코딩 실패 (${store.address}):`, err);
          }
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }

      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error: any) {
      console.warn(`⚠️ ${region} 크롤링 실패:`, error.message);
    }
  }

  return all;
}

module.exports = { crawlSulbingAll };

/* 단독 실행
npx ts-node src/services/crawling/sulbing-crawling.service.ts
*/
if (require.main === module) {
  (async () => {
    try {
      const list = await crawlSulbingAll(); // 플래그 제거
      console.log("🎉 설빙 총 건수:", list.length);
      console.log("📝 샘플 데이터:", JSON.stringify(list.slice(0, 2), null, 2));
      
      const uri = process.env.MONGODB_URI;
      if (!uri) throw new Error("MONGODB_URI 환경변수 없음");
      
      console.log("🔌 데이터베이스 연결 중...");
      await mongoose.connect(uri);
      
      try {
        console.log("🗑️ 기존 설빙 데이터 삭제 중...");
        await Franchise.deleteMany({ brandName: "설빙" });
        console.log("💾 새로운 설빙 데이터 저장 중...");
        await Franchise.insertMany(list, { ordered: false });
        console.log("✅ 설빙 저장 완료");
      } finally {
        await mongoose.disconnect();
        console.log("🔌 데이터베이스 연결 해제");
      }
    } catch (error) {
      console.error("❌ 실행 실패:", error);
      process.exit(1);
    }
  })();
}