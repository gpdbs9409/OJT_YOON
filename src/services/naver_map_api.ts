const axios = require("axios");
require("dotenv").config();

async function geocodeAddress(addr: string) {
  if (!addr) return null;

  const url = "https://maps.apigw.ntruss.com/map-geocode/v2/geocode";
  const { data } = await axios.get(url, {
    params: { query: String(addr).trim() },
    headers: {
      "X-NCP-APIGW-API-KEY-ID": process.env.NAVER_CLIENT_ID,
      "X-NCP-APIGW-API-KEY": process.env.NAVER_CLIENT_SECRET,
      Accept: "application/json",
    },
    timeout: 10000,
    validateStatus: (s: number) => s >= 200 && s < 500,
  });

  const best = data.addresses[0];
  const lng = parseFloat(best.x);
  const lat = parseFloat(best.y);

  
  if (Number.isFinite(lng) && Number.isFinite(lat)) {
    return { type: "Point", coordinates: [lng, lat] };
  }
  return null;
}

module.exports = { geocodeAddress };
