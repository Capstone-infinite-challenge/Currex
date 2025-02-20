import { Router } from "express";
import Sell from '../models/sell.js';
import userService from "../services/userService.js";

const router = Router();

//구매자가 판매 항목을 선택
export default (io) => {
  router.post("/sellSelect", async (req, res) => {
    try {
      const { sellId } = req.body;
      const userId = req.user.id; //로그인 한 사용자

      if (!sellId) {
        return res.status(400).json({ message: "판매 ID와 구매자 ID가 필요합니다." });
      }

      //buyerId를 통해서 objectId && 판매자 프로필 가져오기
      const buyerInfo = await userService.findUserInfo(userId);
      
      if (!buyerInfo) {
        return res.status(404).json({ message: "사용자 정보를 찾을 수 없습니다." });
      }

      const buyerId = buyerInfo.id;     //판매자 아이디
      const buyerImg = buyerInfo.img;   //판매자 프로필 이미지

      //sell 업데이트
      const updateSell = await Sell.findByIdAndUpdate(
        sellId,
        {
          buyer: buyerId,
          status: "거래중",
        },
        { new: true }
      );

      if (!updateSell) {
        return res.status(400).json({ message: "해당 판매 항목을 찾을 수 없습니다." });
      }

      //판매자 정보 (currency, amount)
      const sellInfo = await Sell.findById(sellId);
      
      //프론트에 넘겨줄 값 저장
      const sellDescription = {
        buyerImg: buyerImg,
        currency: sellInfo.currency,
        amount: sellInfo.amount,
        sellImg: sellInfo.images[0] ? `data:${sellInfo.images[0].contentType};base64,${sellInfo.images[0].data.toString("base64")}` : null
      }

      // 소켓을 이용해 구매자에게 채팅방 입장 요청
      try {
        io.to(sellId).emit("updateChat", {message: "거래가 시작되었습니다!", sellId});
      } catch (socketError) {
        console.error("소켓 통신 중 오류 발생", socketError);
      }

      res.status(200).json({
        message: "성공적으로 구매 요청이 완료되었습니다.",
        chatRoomId: sellId,
        sellDescription
      });
    } catch (error) {
      console.log("구매 선택 중 오류 발생", error);
      res.status(500).json({ message: "구매 항목 업데이트 중 오류 발생" });
    }
  });
  return router;
};