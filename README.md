
## 📋 API 엔드포인트

| 메서드 | 엔드포인트 | 설명 |
|--------|------------|------|

| GET | `/api/franchises` | 프랜차이즈 목록 조회 |
| POST | `/api/franchises` | 새로운 프랜차이즈 생성 |
| UPDATE | `/api/franchises/:id` | 프랜차이즈 정보 수정 |
| DELETE | `/api/franchises/:id` | 프랜차이즈 삭제 |

## 🛠️ 기술 스택

- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Language**: TypeScript
- **API Documentation**: Swagger UI
- **Package Manager**: npm


## 시도했는데 못한 것 
1.과제 2- 데이터업데이트파트 
(디렉토리 src/utils/update.ts)
2. 설빙 전화번호 처리 
https://sulbing.com/store/?addr1=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C&addr2=%EA%B0%95%EB%82%A8%EA%B5%AC&search=
입력시 검색결과 리스트에 전화번호 나오지 않고,지도에 가맹점 클릭시 팝업창에만 전화번호가 뜸.
그걸 못 받아 왔습니다. .

몽고db클러스터 주소 
https://cloud.mongodb.com/v2/684b85bcae19c25267538fd5#/explorer/68a6743175388e317fbadcbc

misoya_stores 
: 미소야 데이터 크롤링 
sulbing_stores 
: 설빙 데이터 크롤링 
farnchise_raw
: 마이프차 API 활용 


## 📦 설치 및 실행

### 1. 의존성 설치
```bash
npm install
```

### 2. 환경 변수 설정
`.env` 파일을 생성
```bash
팀장님 카톡으로 보내드리겠습니다..!
```


### 3. 서버 실행
```bash
npx ts-node src/routes/franchises.ts
```

서버가 `http://localhost:3000`에서 실행됩니다.

## 📚 API 문서

서버 실행 후 다음 URL에서 API 문서를 확인할 수 있습니다:
- **Swagger UI**: `http://localhost:3000/api-docs`

## 🔍 API 사용 예시

### 프랜차이즈 목록 조회
```bash
# 조회
GET /api/franchises


### 새로운 프랜차이즈 생성
```bash
POST /api/franchises
Content-Type: application/json

{
  "name": "스타벅스 강남점",
  "addr": "서울시 강남구 테헤란로 123",
  "tel": "02-1234-5678",
  "period": "평일 07:00-22:00, 주말 08:00-21:00"
}
```

### 프랜차이즈 정보 수정
```bash
PATCH /api/franchises/64f1a2b3c4d5e6f7g8h9i0j1
Content-Type: application/json

{
  "tel": "02-9876-5432"
}
```

## 📁 프로젝트 구조

```
마이프차_과제_김혜윤/

├── src/
│   ├── models/            
│   │   ├── branches_crawling.ts #설빙/미소야 크롤링 모델 
│   │   └── branches_from_api.ts  # 마이프차 제공 api 모델 
│   ├── routes/             # API 라우트
│   │   └── franchises.ts
│   ├── services/           
│   │   ├── get_from_api.ts #마이프차 API FECTH함수 
│   │   ├── misoya.ts 
│   │   ├── naver_map_api.ts #네이버 맵 API 위경도 변환 함수수
│   │   ├── save_to_mongo.ts #몽고 DB저장 함수 
│   │   └── sulbing.ts
│   └── utils/             
│       ├── db.ts  # 몽고 DB연결 
│       ├── swagger.ts # 스웨거 API 문서 
│       └── update.ts # 가맹점 업데이트 확인 후 업데이트
├── package.json
├── tsconfig.json
└── README.md
```

## 🔧 개발 환경 설정

### TypeScript 컴파일
```bash
# TypeScript 컴파일
npx tsc

# 개발 모드 실행
npm run dev
```

### MongoDB 연결 확인
서버 시작 시 다음 메시지가 출력되면 정상 연결됩니다:
```
✅ MongoDB connected
🚀 http://localhost:3000
```

## 📝 데이터 모델

### Franchise 스키마
```typescript
interface Franchise {
  _id?: string;        // MongoDB ObjectId
  name: string;        // 프랜차이즈 이름 (필수)
  addr: string;        // 주소 (필수)
  tel: string;         // 전화번호 (필수)
  period?: string;     // 운영 기간 (선택)
  __v?: number;        // MongoDB 버전 키
}
```

## 🚨 에러 처리

API는 다음과 같은 HTTP 상태 코드를 반환합니다:

- **200**: 성공
- **201**: 생성 성공
- **204**: 삭제 성공
- **400**: 잘못된 요청 (잘못된 ID, 필수 필드 누락)
- **404**: 리소스를 찾을 수 없음
- **500**: 서버 내부 오류

