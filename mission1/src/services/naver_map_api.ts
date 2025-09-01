//https://api.ncloud-docs.com/docs/application-maps-geocoding

const axios = require("axios");
require("dotenv").config();

interface Coordinates {
  x: string;
  y: string;
}

async function geocodeAddress(addr: string): Promise<Coordinates | null> {
  if (!addr) return null;

  const url = "https://maps.apigw.ntruss.com/map-geocode/v2/geocode";
  const { data } = await axios.get(url, {
    params: { query: String(addr).trim() },
    headers: {
      "X-NCP-APIGW-API-KEY-ID": process.env.NAVER_CLIENT_ID,
      "X-NCP-APIGW-API-KEY": process.env.NAVER_CLIENT_SECRET,
      Accept: "application/json",
    },

    validateStatus: (s: number) => s >= 200 && s < 500,
  });

  console.log(`주소 "${addr}" 검색 결과:`, JSON.stringify(data, null, 2));

  const addresses = data.addresses;
  console.log(`addresses 배열:`, addresses);

  if (addresses && addresses.length > 0) {
    const best = addresses[0]; // 첫 번째 결과 (가장 정확한 결과)

    // x, y 필드가 있는지 확인
    console.log(`best.x 값: "${best.x}" (길이: ${best.x?.length})`);
    console.log(`best.y 값: "${best.y}" (길이: ${best.y?.length})`);

    // 간단하게 x, y가 존재하면 반환
    if (best.x && best.y) {
      console.log(`좌표 추출 성공: x=${best.x}, y=${best.y}`);
      return {
        x: best.x,
        y: best.y,
      };
    } else {
      console.log(`x 또는 y 필드가 없음: x="${best.x}", y="${best.y}"`);
      return null;
    }
  }

  console.log(`주소 "${addr}"에 대한 좌표를 찾을 수 없음`);
  return null;
}

// 사용 예시:
// const coords = await geocodeAddress("서울특별시 광진구 아차산로 225");
// if (coords) {
//   console.log(`위도: ${coords.y}, 경도: ${coords.x}`);
// }

module.exports = { geocodeAddress };
