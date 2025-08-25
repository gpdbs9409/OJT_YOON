const swaggerJsdoc = require('swagger-jsdoc');

const createSwaggerSpec = (port: number) => {
  const options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'OJT_YOON - 프랜차이즈 API',
        version: '1.0.0',
        description: '프랜차이즈 정보 수집 및 관리 시스템 API',
      },
      servers: [
        {
          url: `http://localhost:${port}`,
          description: '개발 서버',
        },
      ],
    },
    apis: ['./src/api/routes/*.ts'], // 라우트 파일 경로
  };

  return swaggerJsdoc(options);
};

module.exports = { createSwaggerSpec };
