import express from "express";
import session from "express-session";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import sellRoutes from "./routes/sellRoutes.js";
import donationRoutes from "./routes/donationRoutes.js";
import modelRoutes from "./routes/modelRoutes.js"; // ai 모델 추가함
import connectToDatabase from "./configs/mongodb-connection.js";
import Sell from "./models/sell.js";
import authenticateToken from "./middleware/authMiddleware.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  session({
    secret: "sessionsecretkey",
    resave: false,
    saveUninitialized: true,
  })
);

// 정적 파일 제공 (ai 업로드된 이미지 접근 가능하게)
app.use("/uploads", express.static("uploads"));

// 몽고디비 연결
connectToDatabase();

// 구매자 정보 저장용 변수
let buyerInfo = null;

// 라우터
app.use("/auth", authRoutes);
app.use("/sell", authenticateToken, sellRoutes);
app.use("/donation", donationRoutes);
app.use("/api/model", modelRoutes); // YOLO 모델 API 추가

// 변수명
//  currency       // 거래 통화 (jpy, usd)
//  minAmount      // 최소 거래 금액 (외화 기준)
//  maxAmount      // 최대 거래 금액 (외화 기준)
//  exchangeRate   // 환율
//  userLocation   // 거래 희망 위치

// 구매자의 외화 구매 조건 저장
app.post("/buy", authenticateToken, (req, res) => {
  try {
    console.log("Request body:", req.body); // 제대로 값이 들어오는지 확인용
    buyerInfo = {
      currency: req.body.currency,
      minAmount: req.body.minAmount,
      maxAmount: req.body.maxAmount,
      userLocation: req.body.userLocation,
      latitude: req.body.latitude,
      longitude: req.body.longitude,
    };

    // 데이터 유효성 검사
    if (!buyerInfo.currency) {
      return res.status(400).json({ error: "통화를 입력해주세요" });
    } else if (!buyerInfo.minAmount) {
      return res.status(400).json({ error: "최소 금액을 입력해주세요" });
    } else if (!buyerInfo.maxAmount) {
      return res.status(400).json({ error: "최대 금액을 입력해주세요" });
    } else if (buyerInfo.minAmount > buyerInfo.maxAmount) {
      return res
        .status(400)
        .json({ error: "최대 금액은 최소 금액보다 커야 합니다" });
    }

    console.log("저장된 구매자 정보:", buyerInfo);
    res.status(201).json(buyerInfo);
  } catch (error) {
    console.error("에러 발생:", error);
    res.status(500).json({ error: "서버 오류가 발생했습니다" });
  }
});

//판매자 매칭
app.get("/SellerMatch", authenticateToken, async (req, res) => {
  // 구매자 정보를 기준으로 판매자 필터링
  try {
    //구매자 정보가 없는 경우
    if (!buyerInfo) {
      return res.status(400).json({ error: "구매자 정보를 먼저 입력해주세요" });
    }
    const sells = await Sell.find({
      currency: buyerInfo.currency,
      amount: { $gte: buyerInfo.minAmount, $lte: buyerInfo.maxAmount },
    });

    // 거리 계산 및 추가 정보 반환
    const sellersWithDistance = sells.map((seller) => {
      const distance = calculateDistance(
        buyerInfo.latitude,
        buyerInfo.longitude,
        seller.latitude,
        seller.longitude
      );
      return {
        name: seller.name,
        distance: `${distance.toFixed(2)} km`, // 거리 계산 결과
        currency: seller.currency,
        amount: seller.amount,
      };
    });

    // 거리 순 정렬
    sellersWithDistance.sort(
      (a, b) => parseFloat(a.distance) - parseFloat(b.distance)
    );

    console.log("필터링된 판매자 목록:", sellersWithDistance);
    res.status(200).json({ sellersWithDistance, buyerInfo });
  } catch (error) {
    console.error("에러 발생:", error);
    res.status(500).json({ error: "서버 오류가 발생했습니다." });
  }
});

// 거리 계산 함수 (위도, 경도로 거리 계산)
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // 지구의 반지름 (km)
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // 거리 반환 (km)
}

app.post("/SellerMatch/:name", authenticateToken, async (req, res) => {
  try {
    const sellerName = req.params.name;
    const { buyerLatitude, buyerLongitude } = req.body;

    const seller = await Sell.findOne({ name: sellerName });
    if (!seller) {
      return res.status(404).json({ error: "판매자를 찾을 수 없습니다." });
    }

    console.log(seller);

    //중간위치 계산
    const middleLatitude = (buyerLatitude + seller.latitude) / 2;
    const middleLongitude = (buyerLongitude + seller.longitude) / 2;

    console.log(`중간 위도: ${middleLatitude}, 중간 경도: ${middleLongitude}`);

    return res.json({
      middleLatitude,
      middleLongitude,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "서버 오류 발생" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;
