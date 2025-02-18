//const swaggerAutogen = require('swagger-autogen')({ openapi: '3.0.0' });
import swaggerAutogen from 'swagger-autogen';
import dotenv from 'dotenv';

dotenv.config();
const PORT = process.env.PORT; // 사용하는 포트 번호에 맞게 변경

const doc = {
  openapi: '3.0.0',
  info: {
    title: 'CURREX API 명세',
    description: 'CURREX 서비스의 다양한 API를 테스트합니다.',
    version: "1.0.0",
  },
  servers: [
    {
      url: `http://localhost:${PORT}`, // base URL
    },
  ],
  //schemes: ['http'], // 사용할 프로토콜
  components:{
    securitySchemes: {
      bearerAuth:{
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  security: [{bearerAuth: [] }],
};

const outputFile = './swagger/swagger-output.json'; // 생성될 Swagger 설정 파일의 경로 및 파일명
const endpointsFiles = ['./app.js']; // 기본 라우터 즉, app.use("/", router)가 정의된 파일의 경로
swaggerAutogen({ openapi: '3.0.0' })(outputFile, endpointsFiles, doc); // Swagger 문서를 outputFile 경로에 생성