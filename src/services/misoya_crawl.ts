import cheerio = require("cheerio");
import axios = require("axios");
const { geocodeAddress } = require("./naver_map_api");
const Franchise= require("../models/branches_crawling")
const mongoose = require("mongoose");

export type MisoyaStore = {
  brandName: "미소야";
  branchName: string | undefined;
  address: string | undefined;
  phone?: string | undefined;
  location?: { type: "Point"; coordinates: [number, number] };
};

const BASE_URL = "https://misoya.co.kr/map";
const BASE_QUERY = "sort=STREET&keyword_type=all";

async function crawlMisoyaAll(
  maxPages = 50,
): Promise<MisoyaStore[]> {
  const all: MisoyaStore[] = [];
  for (let page = 1; page <= maxPages; page++) {
    const url = `${BASE_URL}/?${BASE_QUERY}&page=${page}`;
    const { data: html } = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36",
        Accept: "text/html,application/xhtml+xml",
      },
      validateStatus: (s) => s >= 200 && s < 400,
    });

    const $ = cheerio.load(html);
    const items: MisoyaStore[] = [];
    $(".map-list-detail .map_container .map_contents").each((_, el) => {
      const $el = $(el);
      const branchName = $el.find(".head .tit").text().trim();
      const address = $el.find(".p_group .adress").text().trim();
      const telHref = $el
        .find(".p_group .tell a[href^='tel:']")
        .attr("href");
      const phone = telHref ? telHref.replace("tel:", "").trim() : undefined;
      items.push({ brandName: "미소야", branchName, address, phone });
    });

    if (items.length === 0) break;

    for (const store of items) {

      if (store.address) {
        const loc = await geocodeAddress(store.address);
        if (loc) store.location = loc;
      }
      all.push(store);
    }
  }
  return all;
}

if (require.main === module) {
  (async () => {
    const list = await crawlMisoyaAll(5);
    console.log("총 건수:", list.length);
    console.log(JSON.stringify(list.slice(0, 2), null, 2));
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error("MONGODB_URI 환경변수 없음");
    await mongoose.connect(uri);
    try {
      await Franchise.deleteMany({});
      await Franchise.insertMany(list, { ordered: false });
      console.log("Misoya 저장 완료");
    } finally {
      await mongoose.disconnect();
    }
  })().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}

module.exports = { crawlMisoyaAll };
