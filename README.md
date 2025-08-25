# OJT_YOON - 프랜차이즈 정보 수집 및 관리 시스템

프랜차이즈 정보를 다양한 소스에서 수집하고 관리하는 Node.js 기반 백엔드 시스템입니다.

## 🚀 주요 기능

### 1. 프랜차이즈 정보 수집
- **API 기반 수집**: MyFranchise API를 통한 프랜차이즈 정보 수집
- **웹 크롤링**: 미소야, 설빙 등 브랜드별 매장 정보 크롤링
- **지오코딩**: 네이버 지도 API를 활용한 주소 좌표 변환

### 2. 데이터 관리
- **MongoDB 연동**: 프랜차이즈 정보 저장 및 관리
- **CRUD API**: 프랜차이즈 정보 생성, 조회, 수정, 삭제


### 3. API 문서화
- **Swagger UI**: 자동 API 문서 생성 및 테스트 인터페이스

## 🏗️ 프로젝트 구조

```
OJT_YOON/
├── src/
│   ├── api/                 # API 관련
│   │   ├── routes/          # 라우트 정의
│   │   │   └── franchise.routes.ts
│   │   └── controllers/     # HTTP 요청/응답 처리
│   │      └── franchise.controller.ts 
│   ├── services/            # 비즈니스 로직
│   │   ├── crawling/        # 크롤링 서비스
│   │   │   ├── misoya-crawling.service.ts
│   │   │   └── sulbing-crawling.service.ts
│   │   ├── myfranchise_api/             # 마이프차 API 연동
│   │   │   └── myfranchise.service.ts
│   │   └── geocoding/       # 지오코딩 서비스
│   │       └── naver-geocoding.service.ts
│   ├── models/              # 데이터 모델
│   │   ├── branches_crawling.ts
│   │   ├── branches_from_api.ts
│   │   └── database.ts
│   ├── repositories/        # 데이터 접근 계층
│   │   └── franchise.repository.ts
│   ├── config/              # 설정 파일
│   │   ├── database.ts      # 데이터베이스 연결
│   │   └── swagger.ts       # Swagger 설정
│   ├── utils/               # 유틸리티
│   └── server.ts            # 서버 실행 파일
├── package.json
├── tsconfig.json
└── README.md
```


## 📦 설치 및 실행

### 1. 의존성 설치
```bash
npm install
```

### 2. 환경 변수 설정
`.env` 파일을 생성

### 3. 애플리케이션 실행
```bash
# 개발 모드
npm run dev

# 또는 직접 실행
node src/server.js
```

## 🔧 사용법

### 1. 프랜차이즈 정보 수집

#### API 기반 수집
```bash
npm run crawl:myfranchise
```

#### 웹 크롤링
```bash
# 미소야 매장 정보 수집
npm run crawl:misoya

# 설빙 매장 정보 수집
npm run crawl:sulbing

# 네이버 지도 API 키 테스트
npm run test:geocoding
```

### 2. API 사용

#### 프랜차이즈 목록 조회
```bash
GET /api/franchises
```

#### 프랜차이즈 생성
```bash
POST /api/franchises
Content-Type: application/json

{
  "brandName": "미소야",
  "branchName": "강남점",
  "address": "서울시 강남구...",
  "phone": "02-1234-5678"
}
```

#### 프랜차이즈 수정
```bash
PATCH /api/franchises/:id
Content-Type: application/json

{
  "phone": "02-9876-5432"
}
```

#### 프랜차이즈 삭제
```bash
POST /api/franchises/:id/delete
```

### 3. API 문서 확인
브라우저에서 `http://localhost:3000/api-docs`에 접속하여 Swagger UI를 통해 API를 테스트할 수 있습니다.

## 📊 데이터 모델

### 프랜차이즈 정보 스키마
```typescript
interface Franchise {
  brandName: string;           // 브랜드명
  branchName?: string;         // 지점명
  address?: string;            // 주소
  phone?: string;              // 전화번호
  location?: {                 // 위치 좌표
    type: "Point";
    coordinates: [number, number]; // [경도, 위도]
  };
  createdAt: Date;             // 생성일시
  updatedAt: Date;             // 수정일시
}
```

## 🔍 주요 API 엔드포인트

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/franchises` | 프랜차이즈 목록 조회 |
| POST | `/api/franchises` | 프랜차이즈 정보 생성 |
| PATCH | `/api/franchises/:id` | 프랜차이즈 정보 수정 |
| POST | `/api/franchises/:id/delete` | 프랜차이즈 정보 삭제 |
| GET | `/api-docs` | Swagger API 문서 |

