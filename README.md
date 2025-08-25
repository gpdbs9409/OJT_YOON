
## 📁 프로젝트 구조

```
OJT_YOON/
├── src/
│   ├── models/
│   │   ├── branches_crawling.ts      # 설빙/미소야 크롤링 모델
│   │   └── branches_from_api.ts      # 마이프차 제공 API 모델
│   ├── routes/
│   │   └── franchises.ts             # CRUD 라우트
│   ├── services/
│   │   ├── get_from_api.ts           # 마이프차 API fetch 함수
│   │   ├── misoya_crawl.ts
│   │   ├── naver_map_api.ts          # 네이버 맵 API (주소→위경도)
│   │   ├── save_to_mongo.ts          # MongoDB 저장 함수
│   │   └── sulbing_crawl.ts
│   └── utils/
│       ├── swagger.ts                # Swagger 설정
│       └── mongoose.ts               
├── package.json
├── tsconfig.json
└── README.md
```

---



## 시도했는데 못한 것

1. 과제 2번 **API 활용 – 데이터 업데이트** 파트
2. 과제 1번 **웹 크롤링 – 설빙**의 **전화번호 수집**

   * 리스트에는 전화번호가 없고, 지도 팝업을 열어야만 확인 가능
   * 참고: [https://sulbing.com/store/?addr1=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C\&addr2=%EA%B0%95%EB%82%A8%EA%B5%AC\&search=](https://sulbing.com/store/?addr1=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C&addr2=%EA%B0%95%EB%82%A8%EA%B5%AC&search=)

---

## DB: MongoDB Atlas

### DB 이름: `My-Franchise`

Collections

* `misoya_stores` : 미소야 데이터 크롤링
* `sulbing_stores` : 설빙 데이터 크롤링
* `franchise_raw` : 마이프차 API 활용

---

## 📦 설치 및 실행

### 1) 의존성 설치

```bash
npm install
```

### 2) 환경 변수 설정

`.env` 파일 생성 (값은 별도 공유)

```bash
OJT노션 권한 주시면 거기에  .env 파일 써놓겠습니다 !
```

### 3) 서버 실행

```bash
npx ts-node src/routes/franchises.ts
# 서버: http://localhost:3000
```

### TypeScript 컴파일

```bash
npx tsc
```

### 개발 모드 실행

```bash
npm run dev
```

---

## 📚 API 문서

* Swagger UI: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

---
# 📋 API 엔드포인트

| 메서드    | 엔드포인트                 | 설명           |
| ------ | --------------------- | ------------ |
| GET    | `/api/franchises`     | 프랜차이즈 목록 조회  |
| POST   | `/api/franchises`     | 새로운 프랜차이즈 생성 |
| PATCH  | `/api/franchises/:id` | 프랜차이즈 정보 수정  |
| DELETE | `/api/franchises/:id` | 프랜차이즈 삭제     |



---
