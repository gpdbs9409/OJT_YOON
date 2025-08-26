const axios = require('axios');
require('dotenv').config();

interface GeocodingResult {
  type: "Point";
  coordinates: [number, number]; // [경도, 위도]
}

class NaverGeocodingService {
  static get BASE_URL() {
    return "https://maps.apigw.ntruss.com/map-geocode/v2/geocode";
  }
  
  static get TIMEOUT() {
    return parseInt(process.env.GEOCODING_TIMEOUT || '10000');
  }

  /**
   * 주소를 좌표로 변환 (지오코딩)
   * @param address 변환할 주소
   * @returns 좌표 정보 또는 null
   */
  static async geocodeAddress(address: string): Promise<GeocodingResult | null> {
    try {
      const { data } = await axios.get(this.BASE_URL, {
        params: { query: String(address).trim() },
        headers: {
          "X-NCP-APIGW-API-KEY-ID": process.env.NAVER_CLIENT_ID,
          "X-NCP-APIGW-API-KEY": process.env.NAVER_CLIENT_SECRET,
          Accept: "application/json",
        },
        timeout: this.TIMEOUT,
        validateStatus: (status: number) => status >= 200 && status < 500,
      });

      const best = data.addresses?.[0];
      if (!best) {
        console.warn(`지오코딩: 주소를 찾을 수 없음 - ${address}`);
        return null;
      }

      const lng = parseFloat(best.x);
      const lat = parseFloat(best.y);

      if (Number.isFinite(lng) && Number.isFinite(lat)) {
        
        return { 
          type: "Point", 
          coordinates: [lng, lat] 
        };
      }

      console.warn(`지오코딩: 좌표 변환 실패 - ${address} -> x:${best.x}, y:${best.y}`);
      return null;
    } catch (error) {
      console.error(`지오코딩 오류: ${address}`, error);
      return null;
    }
  }

  /**
   * 여러 주소를 일괄 지오코딩
   * @param addresses 주소 배열
   * @returns 주소별 좌표 매핑
   */
  static async batchGeocodeAddresses(addresses: string[]): Promise<Map<string, GeocodingResult>> {
    console.log(`지오코딩: ${addresses.length}개 주소 일괄 처리 시작`);
    const results = new Map<string, GeocodingResult>();
    
    for (let i = 0; i < addresses.length; i++) {
      const address = addresses[i];
      if (!address) continue; // undefined 주소 건너뛰기
      
      console.log(`지오코딩 진행: ${i + 1}/${addresses.length} - ${address}`);
      
      const result = await this.geocodeAddress(address);
      if (result) {
        results.set(address, result);
      }
      
      // API 호출 간격 조절 (초당 10회 제한 고려)
      if (i < addresses.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
    console.log(`지오코딩 완료: ${results.size}/${addresses.length}개 성공`);
    return results;
  }
}

module.exports = { NaverGeocodingService };

