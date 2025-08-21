export interface Franchise {
  _id?: string;
  name: string;        // 지점명 (예: "부산명지 CGV점")
  addr: string;        // 주소 (예: "부산광역시 강서구 명지국제8로 10번길 38, 1층")
  tel: string;         // 전화번호 (예: "051-207-6001")
  period?: string;     // 운영시간 (선택사항, 현재 빈 문자열)
  __v?: number;        // 버전 키 (MongoDB에서 자동 생성)
}

