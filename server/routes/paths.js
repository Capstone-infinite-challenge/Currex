import authRoutes from "./authRoutes.js";
import sellRoutes from "./sellRoutes.js";
import donationRoutes from "./donationRoutes.js";
import modelRoutes from "./modelRoutes.js"; // ai 모델 추가함
import authenticateToken from "../middleware/authMiddleware.js";
import userRoutes from "./userRoutes.js";
import tradeRoutes from "./tradeRoutes.js";

//swagger
import swaggerUi from "swagger-ui-express";
import swaggerOutput from "./swagger/swagger-output.json" assert { type: "json" };

app.use("/auth", authRoutes);
app.use("/sell", authenticateToken, sellRoutes);
app.use("/donation", donationRoutes);
app.use("/user", authenticateToken, userRoutes);
app.use("/trade", authenticateToken, tradeRoutes);
app.use("/api/model", modelRoutes); // YOLO 모델 API 추가
app.use("/uploads", express.static("uploads"));   // 정적 파일 제공 (ai 업로드된 이미지 접근 가능하게)

//swaggerUI 설정
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerOutput)); // http://localhost:5000/api/api-docs로 Swagger 페이지 접속 가능