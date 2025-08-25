const axios = require('axios');
const cheerio = require('cheerio');
const { NaverGeocodingService } = require('../geocoding/naver-geocoding.service');
const { saveToMongo } = require('../../repository/franchise');
const { HeadersGenerator } = require('../../utils/headers');

class MisoyaCrawlingService {
  static get BASE_URL() {
    return "https://misoya.co.kr/map";
  }
  
  static get BASE_QUERY() {
    return "sort=STREET&keyword_type=all";
  }

  /**
   * 미소야 모든 매장 정보 크롤링
   * @param maxPages 최대 페이지 수 (기본값: 50)
   * @returns 매장 정보 배열
   */
  static async crawlAllStores(maxPages = 50) {
    const all = [];
    
    try {
      for (let page = 1; page <= maxPages; page++) {
        const url = `${this.BASE_URL}/?${this.BASE_QUERY}&page=${page}`;
        console.log(`📄 페이지 ${page} 크롤링 중: ${url}`);
        
        const { data: html } = await axios.get(url, {
          headers: HeadersGenerator.generateCrawlingHeaders(),
          validateStatus: (status: number) => status >= 200 && status < 400,
        });

        const $ = cheerio.load(html);
        const items: any[] = [];
        
        $(".map-list-detail .map_container .map_contents").each((_: any, el: any) => {
          const $el = $(el);
          const branchName = $el.find(".head .tit").text().trim();
          const address = $el.find(".p_group .adress").text().trim();
          const telHref = $el
            .find(".p_group .tell a[href^='tel:']")
            .attr("href");
          const phone = telHref ? telHref.replace("tel:", "").trim() : undefined;
          
          if (branchName || address) {
            items.push({ 
              brandName: "미소야", 
              branchName, 
              address, 
              phone 
            });
          }
        });

        if (items.length === 0) {
          console.log(`페이지 ${page}에서 더 이상 데이터가 없습니다. 크롤링 종료.`);
          break;
        }

        console.log(`페이지 ${page}: ${items.length}개 매장 발견`);

        // 지오코딩 적용
        for (const store of items) {
          if (store.address) {
            try {
              const loc = await NaverGeocodingService.geocodeAddress(store.address);
              if (loc) {
                store.location = loc;

              }
            } catch (error) {
              console.warn(`지오코딩 실패 (${store.address}):`, error);
            }
            
          }
          all.push(store);
        }
      }
      
      console.log(`✅ 미소야 크롤링 완료: 총 ${all.length}개 매장`);
      return all;
    } catch (error) {
      console.error('❌ 미소야 크롤링 실패:', error);
      throw error;
    }
  }

  /**
   * 크롤링 결과를 MongoDB에 저장
   */
  static async crawlAndSave(maxPages = 50) {
    try {
      const stores = await this.crawlAllStores(maxPages);
      await saveToMongo(stores);
      console.log('✅ 미소야 매장 정보 저장 완료');
    } catch (error) {
      console.error('❌ 미소야 크롤링 및 저장 실패:', error);
      throw error;
    }
  }
}

// 직접 실행 시
if (require.main === module) {
  MisoyaCrawlingService.crawlAndSave(5)
    .then(() => {
      console.log("프로세스 완료");
      process.exit(0);
    })
    .catch((error) => {
      console.error("프로세스 실패:", error);
      process.exit(1);
    });
}

module.exports = { MisoyaCrawlingService };
