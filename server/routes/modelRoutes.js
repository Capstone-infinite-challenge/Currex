import express from "express";
import multer from "multer";
import path from "path";
import { predictCurrency } from "../services/modelService.js"; // FastAPI 요청 함수 불러오기

const router = express.Router();

// 이미지 업로드 설정 (Multer 사용)
const storage = multer.diskStorage({
  destination: "uploads/", // 이미지 저장 경로
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage });

// AI 모델 예측 API
router.post("/predict", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const imagePath = req.file.path;
  const prediction = await predictCurrency(imagePath);

  res.json(prediction);
});

// ✅ ESM 방식으로 내보내기 (`export default` 사용)
export default router;
