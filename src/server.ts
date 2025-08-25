const express = require('express');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config();
const { connectMongoose } = require('./config/database');
const { createSwaggerSpec } = require('./config/swagger');
const franchiseRoutes = require('./api/routes/franchise.routes');

const app = express();
const PORT = Number(process.env.PORT || 3000);



// Swagger 설정
const specs = createSwaggerSpec(PORT);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// API 라우트 설정
app.use('/api/franchises', franchiseRoutes);

// 루트 엔드포인트
app.get('/', (req: any, res: any  ) => {
  res.json({
    message: 'OJT_YOON - 프랜차이즈 정보 수집 및 관리 시스템',
    version: '1.0.0',
    endpoints: {
      api: '/api/franchises',
      docs: '/api-docs'
    },
    timestamp: new Date().toISOString()
  });
});

// 서버 시작
async function startServer() {
  try {
    // MongoDB 연결
    await connectMongoose();
    
    // 서버 시작
    app.listen(PORT, () => {
      console.log('🚀 서버가 시작되었습니다!');
      console.log(`📍 서버 주소: http://localhost:${PORT}`);
      console.log(`📚 API 문서: http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error('❌ 서버 시작 실패:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM 신호를 받았습니다. 서버를 종료합니다...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT 신호를 받았습니다. 서버를 종료합니다...');
  process.exit(0);
});

// 서버 시작
startServer();
