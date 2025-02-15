import { Router } from "express";
import Sell from "../models/sell.js";
import calculateDistance from "../utils/calculate.js";

const router = Router();


// 구매자의 외화 구매 조건 저장
router.post("/buy", (req, res) => {
  // 구매자 정보 저장용 변수
  let buyerInfo = null;
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

    req.session.buyerInfo = buyerInfo;

    console.log("저장된 구매자 정보:", buyerInfo);
    res.status(201).json(buyerInfo);
  } catch (error) {
    console.error("에러 발생:", error);
    res.status(500).json({ error: "서버 오류가 발생했습니다" });
  }
});

//판매자 매칭
router.get("/SellerMatch", async (req, res) => {
  // 구매자 정보를 기준으로 판매자 필터링
  const buyerInfo = req.session.buyerInfo; 
  const currentUserId = req.user.id;  // 현재 로그인한 사용자의 ID
  try {
    //구매자 정보가 없는 경우
    if (!buyerInfo) {
      return res.status(400).json({ error: "구매자 정보를 먼저 입력해주세요" });
    }
    const sells = await Sell.find({
      currency: buyerInfo.currency,
      amount: { $gte: buyerInfo.minAmount, $lte: buyerInfo.maxAmount },
      status: '판매중'  // 판매 중인 상품만 필터링
    });

    // 본인의 판매글 제외 (판매자 ID로 비교)
    const filteredSells = sells.filter(sell => sell.sellerId !== currentUserId);

    console.log("🔍 백엔드 - 필터링 전 판매 리스트:", sells.map(sell => sell.sellerId));
console.log("🔍 백엔드 - 현재 사용자 ID:", currentUserId);


    // 거리 계산 및 추가 정보 반환
    const sellersWithDistance = filteredSells.map((seller) => {
      const distance = calculateDistance(
        buyerInfo.latitude,
        buyerInfo.longitude,
        seller.latitude,
        seller.longitude
      );
      return {
        _id: seller._id,
        name: seller.name,
        distance: distance,
        currency: seller.currency,
        amount: seller.amount,
        location: seller.location,
        images: seller.images.map(image =>
          `data:${image.contentType};base64,${image.data.toString('base64')}`
        ),
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


router.post("/SellerMatch/:name", async (req, res) => {
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


//환전 조회 기능


export default router;