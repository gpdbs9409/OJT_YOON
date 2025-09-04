import axios from "axios";

import * as dotenv from "dotenv";
dotenv.config();

interface GeoJSONPoint {
  type: "Point";
  coordinates: [number, number]; // [longitude, latitude]
}

async function geocodeAddress(addr: string): Promise<GeoJSONPoint | null> {
  if (!addr) return null;

  const url = "https://maps.apigw.ntruss.com/map-geocode/v2/geocode";
  const { data } = await axios.get(url, {
    params: { query: String(addr).trim() },
    headers: {
      "X-NCP-APIGW-API-KEY-ID": process.env.NAVER_CLIENT_ID,
      "X-NCP-APIGW-API-KEY": process.env.NAVER_CLIENT_SECRET,
      Accept: "application/json",
    },
  });

  const addresses = data.addresses;

  if (addresses && addresses.length > 0) {
    const point = addresses[0]; // 첫 번째 결과 (가장 정확한 결과)

    // x, y가 존재하면 GeoJSON Point 형식으로 반환
    if (point.x && point.y) {
      return {
        type: "Point",
        coordinates: [parseFloat(point.x), parseFloat(point.y)], // [경도, 위도]
      };
    } else {
      console.log(`x 또는 y 필드가 없음: x="${point.x}", y="${point.y}"`);
      return null;
    }
  }

  console.log(`주소 "${addr}"에 대한 좌표를 찾을 수 없음`);
  return null;
}

export { geocodeAddress };
