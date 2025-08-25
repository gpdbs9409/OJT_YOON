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

  static get API_KEY_ID() {
    const keyId = process.env.NAVER_CLIENT_ID;
    if (!keyId) {
      throw new Error('NAVER_CLIENT_ID 환경변수가 설정되지 않았습니다.');
    }
    return keyId;
  }

  static get API_KEY_SECRET() {
    const keySecret = process.env.NAVER_CLIENT_SECRET;
    if (!keySecret) {
      throw new Error('NAVER_CLIENT_SECRET 환경변수가 설정되지 않았습니다.');
    }
    return keySecret;
  }

  /**
   * 주소를 좌표로 변환 (지오코딩)
   * @param address 변환할 주소
   * @returns 좌표 정보 또는 null
   */
  static async geocodeAddress(address: string): Promise<GeocodingResult | null> {
    if (!address) {
      console.warn('지오코딩: 주소가 제공되지 않았습니다.');
      return null;
    }

    try {
      const { data } = await axios.get(this.BASE_URL, {
        params: { query: String(address).trim() },
        headers: {
          "X-NCP-APIGW-API-KEY-ID": this.API_KEY_ID,
          "X-NCP-APIGW-API-KEY": this.API_KEY_SECRET,
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
        console.log(`지오코딩 성공: ${address} -> [${lng}, ${lat}]`);
        return { 
          type: "Point", 
          coordinates: [lng, lat] 
        };
      }

      console.warn(`지오코딩: 좌표 변환 실패 - ${address} -> x:${best.x}, y:${best.y}`);
      return null;
    } catch (error: any) {
      if (error.response?.status === 401) {
        console.error('지오코딩: API 키가 유효하지 않습니다. NAVER_CLIENT_ID와 NAVER_CLIENT_SECRET을 확인하세요.');
      } else if (error.response?.status === 429) {
        console.error('지오코딩: API 호출 한도를 초과했습니다. 잠시 후 다시 시도하세요.');
      } else {
        console.error(`지오코딩 실패 (${address}):`, error.message || error);
      }
      return null;
    }
  }

  /**
   * 여러 주소를 일괄 지오코딩
   * @param addresses 주소 배열
   * @returns 주소별 좌표 매핑
   */
  static async batchGeocodeAddresses(addresses: string[]): Promise<Map<string, GeocodingResult>> {
    if (!addresses || addresses.length === 0) {
      console.warn('지오코딩: 처리할 주소가 없습니다.');
      return new Map();
    }

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

  /**
   * API 키 유효성 검사
   */
  static async validateApiKey(): Promise<boolean> {
    try {
      console.log('지오코딩: API 키 유효성 검사 시작...');
      const testAddress = "서울특별시 강남구";
      const result = await this.geocodeAddress(testAddress);
      
      if (result) {
        console.log('✅ 네이버 지도 API 키가 유효합니다.');
        return true;
      } else {
        console.log('❌ 네이버 지도 API 키가 유효하지 않습니다.');
        return false;
      }
    } catch (error: any) {
      console.error('지오코딩: API 키 검증 중 오류 발생:', error.message || error);
      return false;
    }
  }

  
}

module.exports = { NaverGeocodingService };

// 직접 실행 시 API 키 검증
if (require.main === module) {
  console.log('🔍 네이버 지도 API 키 검증 시작...');

  NaverGeocodingService.validateApiKey()
    .then(isValid => {
      if (isValid) {
        console.log('✅ 네이버 지도 API 키가 유효합니다.');
        process.exit(0);
      } else {
        console.log('❌ 네이버 지도 API 키가 유효하지 않습니다.');
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('API 키 검증 중 오류 발생:', error);
      process.exit(1);
    });
}
