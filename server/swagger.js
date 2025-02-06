//const swaggerAutogen = require('swagger-autogen')({ openapi: '3.0.0' });
import swaggerAutogen from 'swagger-autogen';
import dotenv from 'dotenv';

dotenv.config();
const PORT = process.env.PORT; // 사용하는 포트 번호에 맞게 변경

const doc = {
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
  schemes: ['http'], // 사용할 프로토콜
  securityDefinitions: { // JWT 인증을 위한 설정
    bearerAuth: {
      type: 'http',
      scheme: 'bearer',
      in: 'header',
      bearerFormat: 'JWT',
    },
    kakaoAuth: {
        type: "oauth2",
        flow: "implicit",
        authorizationUrl: `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.REST_API_KEY}&redirect_uri=${process.env.REDIRECT_URI}&response_type=code`,
        scopes: {
          profile: "카카오 프로필 정보",
        },
    },
    googleAuth: {
      type: "oauth2",
      flow: "implicit",
      authorizationUrl: `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${process.env.GOOGLE_REDIRECT_URI}&response_type=code&scope=email%20profile`,
      scopes: {
        email: "이메일 정보",
        profile: "프로필 정보",
      },
    },
  },
};

const outputFile = './swagger/swagger-output.json'; // 생성될 Swagger 설정 파일의 경로 및 파일명
const endpointsFiles = ['./app.js']; // 기본 라우터 즉, app.use("/", router)가 정의된 파일의 경로
swaggerAutogen(outputFile, endpointsFiles, doc); // Swagger 문서를 outputFile 경로에 생성