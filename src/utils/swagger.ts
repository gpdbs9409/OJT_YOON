const swaggerJsdoc = require("swagger-jsdoc");

function createSwaggerSpec(port: number) {
  const swaggerOptions = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "프랜차이즈 API",
        version: "1.0.0",
        description: "프랜차이즈 정보를 관리하는 REST API",
      },
      servers: [
        {
          url: `http://localhost:${port}`,
          description: "개발 서버",
        },
      ],
    },
    apis: ["./src/routes/*.ts"], // API 라우트 파일들
  };

  return swaggerJsdoc(swaggerOptions);
}

module.exports = { createSwaggerSpec };
