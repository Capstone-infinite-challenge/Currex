import authRoutes from "./authRoutes.js";
import sellRoutes from "./sellRoutes.js";
import donationRoutes from "./donationRoutes.js";
import modelRoutes from "./modelRoutes.js"; // ai 모델 추가함
import authenticateToken from "../middleware/authMiddleware.js";
import userRoutes from "./userRoutes.js";
import tradeRoutes from "./tradeRoutes.js";
import chatRoutes from "./chatRoutes.js";
import express from "express";
import fs from "fs";

const router = express.Router();

//swagger
import swaggerUi from "swagger-ui-express";
//import swaggerOutput from "../swagger/swagger-output.json" assert { type: "json" };
const swaggerOutput = JSON.parse(
  fs.readFileSync(
    new URL("../swagger/swagger-output.json", import.meta.url),
    "utf-8"
  )
);

//일반적인 라우터
router.use("/auth", authRoutes);
router.use("/sell", authenticateToken, sellRoutes);
router.use("/donation", authenticateToken, donationRoutes);
router.use("/user", authenticateToken, userRoutes);
router.use("/trade", authenticateToken, tradeRoutes);
router.use("/api/model", modelRoutes); // YOLO 모델 API 추가
router.use("/uploads", express.static("uploads")); // 정적 파일 제공 (ai 업로드된 이미지 접근 가능하게)

//swaggerUI 설정
router.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerOutput)); // http://localhost:5000/api/api-docs로 Swagger 페이지 접속 가능


//io객체 사용하는 라우터 io 객체 전달받아 라우터 처리
export default (io) => {
  router.use("/chat", authenticateToken, chatRoutes(io));

  return router;
};
