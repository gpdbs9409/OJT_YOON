import axios from "axios";

import * as dotenv from "dotenv";
dotenv.config();

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

  const addresses = data.addresses;

  if (addresses && addresses.length > 0) {
    const best = addresses[0]; // 첫 번째 결과 (가장 정확한 결과)

    // 간단하게 x, y가 존재하면 반환
    if (best.x && best.y) {
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

export { geocodeAddress };
