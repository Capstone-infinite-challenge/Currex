import { Router } from "express";
import Sell from "../models/sell.js";
import calculate from "../utils/calculate.js";
import chatService from "../services/chatService.js";
import userService from "../services/userService.js";

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
router.patch("/SellerMatch", async (req, res) => {
  // 구매자 정보를 기준으로 판매자 필터링
  const buyerInfo = req.body;
  const currentUserId = req.user.id; // 현재 로그인한 사용자의 ID
  try {
    //구매자 정보가 없는 경우
    if (!buyerInfo) {
      return res.status(400).json({ error: "구매자 정보를 먼저 입력해주세요" });
    }

    console.log("구매자 정보:", buyerInfo);

    //구매자의 trade_address가 null인 경우 입력한 정보로 업데이트 ---- 이 부분 에러 수정 필요
    let buyer = await userService.findUserInfo(currentUserId);

    console.log(buyer.tradeAddress);

    //trade_address가 null이면 업데이트
    if (!buyer.tradeAddress) {
      await userService.updateTradeAddress(
        currentUserId,
        buyerInfo.userLocation,
        buyerInfo.latitude,
        buyerInfo.longitude
      );
    }

    //판매자 조회
    const sells = await Sell.find({
      currency: buyerInfo.currency,
      amount: { $gte: buyerInfo.minAmount, $lte: buyerInfo.maxAmount },
      status: "판매중", // 판매 중인 상품만 필터링
    });

    // 본인의 판매글 제외 (판매자 ID로 비교)
    const filteredSells = sells.filter(
      (sell) => String(sell.sellerId) !== String(currentUserId)
    );

    // 거리 계산 및 추가 정보 반환
    const sellersWithDistance = filteredSells.map((seller) => {
      const distance = calculate.calculateDistance(
        buyerInfo.latitude,
        buyerInfo.longitude,
        seller.latitude,
        seller.longitude
      );
      return {
        _id: seller._id,
        sellerId: seller.sellerId,
        name: seller.name,
        distance: distance,
        currency: seller.currency,
        amount: seller.amount,
        location: seller.location,
        images: seller.images.map(
          (image) =>
            `data:${image.contentType};base64,${image.data.toString("base64")}`
        ),
      };
    });

    // 거리 순 정렬
    sellersWithDistance.sort(
      (a, b) => parseFloat(a.distance) - parseFloat(b.distance)
    );

    //console.log("필터링된 판매자 목록:", sellersWithDistance);
    res.status(200).json({ sellersWithDistance, buyerInfo });
  } catch (error) {
    console.error("에러 발생:", error);
    res.status(500).json({ error: "서버 오류가 발생했습니다." });
  }
});

//채팅 목록(io객체 필요없어서 여기에)
router.get("/list", async (req, res) => {
  const userId = req.user.id;
  console.log(userId); //점검용
  const objectUserId = (await userService.findUserInfo(userId)).id;
  try {
    const chatList = await chatService.getChatList(objectUserId);
    res.status(200).json(chatList);
  } catch (error) {
    console.log("채팅 리스트 불러오는 도중 에러 발생", error);
    res.status(500).json({ message: "채팅 리스트 반환 중 에러 발생" });
  }
});

export default router;
