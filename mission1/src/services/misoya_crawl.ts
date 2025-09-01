import cheerio = require("cheerio");
import axios = require("axios");
const { geocodeAddress } = require("./naver_map_api");

const BASE_URL = "https://misoya.co.kr/map?sort=STREET&keyword_type=all";

//미소야 타입 정의
export type MisoyaStore = {
  brandName: "미소야";
  branchName: string;
  address: string;
  phone: string;
  location: { type: "Point"; coordinates: [string, string] };
  timestamp: string;
};

//미소야 크롤링 함수
async function crawlMisoyaAll(maxPages = 50): Promise<MisoyaStore[]> {
  const all: MisoyaStore[] = [];
  for (let page = 1; page <= maxPages; page++) {
    const url = `${BASE_URL}&page=${page}`;
    const { data: html } = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36",
        Accept: "text/html,application/xhtml+xml",
      },
    });

    const $ = cheerio.load(html);
    const stores = $(".map-list-detail .map_container .map_contents");

    // for 루프로 변경
    for (let i = 0; i < stores.length; i++) {
      const el = stores[i];
      const $el = $(el);
      const branchName = $el.find(".head .tit").text().trim();
      const address = $el.find(".p_group .adress").text().trim();
      const telHref = $el.find(".p_group .tell a[href^='tel:']").attr("href");
      const phone = telHref ? telHref.replace("tel:", "").trim() : "";

      try {
        const loc = await geocodeAddress(address);
        const location = {
          type: "Point" as const,
          coordinates: [loc.x, loc.y] as [string, string],
        };
        const timestamp = new Date().toISOString();

        all.push({
          brandName: "미소야",
          branchName,
          address,
          phone,
          location,
          timestamp,
        });
        console.log(`미소야 매장 추가: ${branchName} - ${address}`);
      } catch (error) {
        console.error(`주소 변환 실패 (${address}):`, error);
      }
    }

    if (all.length === 0) break;
  }
  return all;
}

module.exports = { crawlMisoyaAll };
