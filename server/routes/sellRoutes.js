import { Router } from "express";
import multer from "multer"; // 파일 업로드 미들웨어
import Sell from "../models/sell.js";
import sellService from "../services/sellService.js";
import userService from "../services/userService.js";
import User from "../models/user.js";
import calculateDistance from "../utils/calculate.js";
import mongoose from "mongoose";


// Multer 설정: 파일 메모리 저장
const upload = multer({ storage: multer.memoryStorage() });

const router = Router();

//판매 등록 페이지
router.post("/productRegi", upload.array("images", 5), async (req, res) => {
  try {
    //로그인 정보 가져오기
    if (!req.user) {
      return res.status(401).json({ error: "로그인이 필요합니다." });
    }

    //seller 정보 찾기
    const seller = await userService.findUserInfo(req.user.id);

    //사용자 정보 할당
    const sellInfo = {
      sellerId: seller.id, 
      name: req.user ? req.user.nickname : "판매자",  
      currency: req.body.currency,
      amount: req.body.amount,
      location: req.body.sellerLocation,
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      content: req.body.content,
      images: [],
    };

     //파일 저장하기
     if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        sellInfo.images.push({
          data: file.buffer,
          contentType: file.mimetype,
        });
      });
    }

    // 데이터 유효성 검사
    if (!sellInfo.currency) {
      return res.status(400).json({ error: "통화를 입력해주세요" });
    } else if (!sellInfo.amount) {
      return res.status(400).json({ error: "금액을 입력해주세요" });
    } else if (!sellInfo.images) {
      return res.status(400).json({ error: "사진을 등록해주세요" });
    }

    //데이터베이스에 sell 정보 저장하기
    const newSell = new Sell(sellInfo);
    await newSell.save();

    //user에도 sell정보 연결
    await User.findByIdAndUpdate(seller.id, { $push: { sells: newSell._id } });

    res
      .status(201)
      .json({ message: "판매 등록이 완료되었습니다", sell: newSell });
  } catch (error) {
    console.error("에러 발생:", error);
    res.status(500).json({ error: "서버 오류가 발생했습니다" });
  }
});


// 전체 판매 목록 페이지
router.get("/sellList", async (req, res) => {
  try {
    const sellList = await Sell.find({ status: "판매중" });

    if (!sellList || sellList.length === 0) {
      return res.status(404).json({ message: "판매중인 상품이 없습니다." });
    }

    const myInfo = await userService.findUserInfo(req.user.id);

    // 이미지 데이터를 Base64로 변환
    const formattedSellList = sellList.map((sell) => ({
      ...sell.toObject(), // Mongoose 객체를 JSON으로 변환
      distance: calculateDistance(
        myInfo.latitude,
        myInfo.longitude,
        sell.latitude,
        sell.longitude
      ),
      images: sell.images.map(
        (image) =>
          `data:${image.contentType};base64,${image.data.toString("base64")}`
      ),
    }));

    res.status(200).json(formattedSellList);
  } catch (error) {
    console.error("Error fetching sell list:", error);
    res
      .status(500)
      .json({ message: "판매자 목록을 불러오는 도중 에러가 발생하였습니다." });
  }
});

//구매자가 판매 항목을 선택
router.post("/sellSelect", async (req, res) => {
  try {
    const { sellId } = req.body;
    const buyerId = req.user.id; //로그인 한 사용자

    console.log("로그인한 사용자 ID:", buyerId);
    console.log("MongoDB ObjectId 변환 가능 여부:", mongoose.Types.ObjectId.isValid(buyerId));
    if (!sellId) {
      return res
        .status(400)
        .json({ message: "판매 ID와 구매자 ID가 필요합니다." });
    }

    const updateSell = await Sell.findByIdAndUpdate(
      sellId,
      {
        buyer: buyerId,
        status: "거래중",
      },
      { new: true }
    );

    if (!updateSell) {
      return res
        .status(400)
        .json({ message: "해당 판매 항목을 찾을 수 없습니다." });
    }
    res.status(200).json({
      message: "판매 항목이 성공적으로 업데이트되었습니다.",
      updatedSell: updateSell,
    });
  } catch (error) {
    console.log("판매 선택 중 오류 발생", error);
    res.status(500).json({ message: "판매 항목 업데이트 중 오류 발생" });
  }
});



//내 판매 목록
router.get("/mySells", async (req, res) => {
  const userId = req.user.id;
  const mySells = await Sell.find({ sellerId: userId });

  if (!mySells || mySells.length === 0) {
    return res.status(404).json({ message: "판매중인 상품이 없습니다." });
  }
  try {
    // 이미지 데이터를 Base64로 변환
    const formattedmySells = mySells.map((sell) => ({
      ...sell.toObject(),
      images: sell.images.map(
        (image) =>
          `data:${image.contentType};base64,${image.data.toString("base64")}`
      ),
    }));
    res.status(200).json(formattedmySells);
  } catch (error) {
    console.error("Error fetching mySells:", error);
    res
      .status(500)
      .json({ message: "내 판매 목록을 불러오는 도중 에러가 발생하였습니다." });
  }
});

//판매자가 판매 상태 변환
router.patch("/:sellId/status", async(req, res) => {
  try{
    const sell = await Sell.findByIdAndUpdate(req.params.sellId, { status: req.body.status }, { new: true});
    res.json(sell);
  }catch(error){
    res.status(500).json({message: "Error updating sell status"});
  }
});

export default router;
