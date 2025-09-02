# 마이프차 과제 - 김혜윤

## 프로젝트 구조

```
OJT_YOON/
├── src/
│   ├── crud_api/                    # CRUD API 서버
│   │   ├── controllers/
│   │   │   └── franchise.controller.ts  # 프랜차이즈 컨트롤러
│   │   ├── routes/
│   │   │   └── franchise.routes.ts      # 프랜차이즈 라우트
│   │   └── server.ts                     # CRUD API 서버
│   ├── models/
│   │   ├── branches_crawling.ts      # 설빙/미소야 크롤링 모델
│   │   └── branches_from_api.ts      # 마이프차 제공 API 모델
│   ├── routes/
│   │   └── franchises_crud.ts        # 프랜차이즈 CRUD 라우트
│   ├── services/
│   │   ├── daily_scheduler.ts        # 일일 스케줄러
│   │   ├── get_from_api.ts           # 마이프차 API fetch 함수
│   │   ├── misoya_crawl.ts           # 미소야 크롤링 서비스
│   │   ├── naver_map_api.ts          # 네이버 맵 API (주소→위경도)
│   │   ├── save_to_mongo.ts          # MongoDB 저장 함수
│   │   └── sulbing_crawl.ts          # 설빙 크롤링 서비스
│   └── utils/
│       ├── mongoose.ts               # MongoDB 연결
│       ├── swagger.ts                # Swagger 설정
│       └── headers.ts                # 가맹점 업데이트 확인/적용
├── package.json
├── package-lock.json
├── tsconfig.json
├── .gitignore
└── README.md
```
