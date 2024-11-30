import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectToDatabase from "./configs/mongodb-connection.js";
import Seller from "./models/seller-model.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 몽고디비 연결
connectToDatabase();

// 구매자 정보 저장용 변수
let buyerInfo = null;

// 구매자의 외화 구매 조건 저장
app.post("/buy", (req, res) => {
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

// 판매자 매칭
app.get("/SellerMatch", async (req, res) => {
  try {
    // 구매자 정보가 없는 경우
    if (!buyerInfo) {
      return res.status(400).json({ error: "구매자 정보를 먼저 입력해주세요" });
    }

    // 구매자 정보를 기준으로 판매자 필터링
    const sellers = await Seller.find({
      currency: buyerInfo.currency,
      amount: { $gte: buyerInfo.minAmount, $lte: buyerInfo.maxAmount },
    });

    // 거리 계산 및 추가 정보 반환
    const sellersWithDistance = sellers.map((seller) => {
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
    res.status(200).json(sellersWithDistance);
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
