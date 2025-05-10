import { Router } from "express";
import Sell from '../models/sell.js';
import userService from "../services/userService.js";
import chatService from "../services/chatService.js";
import calculate from "../utils/calculate.js";
import mongoose from "mongoose";
import sell from "../models/sell.js";
import redisService from "../services/redisService.js";

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

      //이미 내가 문의하고 있는 채팅방일 경우 -> 해당 채팅방으로 이동
      const isChat = await chatService.findChatRoom(sellId, buyerId) || chatService.findChatRoomById(sellId);

      if(isChat){
        return res.status(200).json({
          message: "이미 채팅중인 상품입니다.",
          chatRoomId: sellId,
          sellId: sellId
        });
      };

      //sell 업데이트
      const updateSell = await Sell.findByIdAndUpdate(
        sellId,
        {
          buyer: buyerId,
          status: "판매중",
        },
        { new: true }
      );

      if (!updateSell) {
        return res.status(400).json({ message: "해당 판매 항목을 찾을 수 없습니다." });
      }

      //판매자 정보 (currency, amount)
      const sellInfo = await Sell.findById(sellId);
      const sellerId = sellInfo.sellerId;   //판매자 ID

      //프론트에 넘겨줄 값 저장
      const sellDescription = {
        sellId: sellId,
        buyerImg: buyerImg,
        currency: sellInfo.currency,
        amount: sellInfo.amount,
        status: sellInfo.status,
        sellImg: sellInfo.images[0] ? `data:${sellInfo.images[0].contentType};base64,${sellInfo.images[0].data.toString("base64")}` : null
      }

      // 소켓을 이용해 구매자에게 채팅방 입장 요청
      try {
        io.to(sellId).emit("updateChat", {message: "거래가 시작되었습니다!", sellId});
      
        //판매자도 해당 방에 입장 시킴
        io.to(sellId).emit("updateChat", {message: "판매자가 입장했습니다.", sellId});
        
        //판매자와 구매자 채팅방에 입장시킴
        io.to(buyerId).emit("joinRoom", {chatRoomId: sellId})    //구매자 입장
        io.to(sellerId).emit("joinRoom", {chatRoomId: sellId});   //판매자 입장
      
      } catch (socketError) {
        console.error("소켓 통신 중 오류 발생", socketError);
      }

      //채팅방 db 저장
      chatService.createChatRoom(sellId, sellerId, buyerId);
      
      res.status(200).json({
        message: "성공적으로 구매 요청이 완료되었습니다.",
        chatRoomId: sellId,
        sellId: sellId,
        sellDescription
      });
    } catch (error) {
      console.log("구매 선택 중 오류 발생", error);
      res.status(500).json({ message: "구매 항목 업데이트 중 오류 발생" });
    }
  });

  // 채팅방에서 상대의 info 보여주기
  router.get("/opponentInfo", async (req, res) => {
    const chatRoomId = req.query.chatRoomId; // Get 요청에서는 req.query로 받아야 함
    const user = await userService.findUserInfo(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
    }

    try {
      const chatters = await chatService.getChatters(chatRoomId); 
      let opponentInfo = null;

      if (user.id.toString() === chatters.buyer.toString()) {
        opponentInfo = await chatService.getSellerInfo(chatRoomId);
      } else if (user.id.toString() === chatters.seller.toString()) {
        opponentInfo = await chatService.getBuyerInfo(chatRoomId);
      } else {
        return res.status(403).json({ message: "채팅방에 속해 있지 않습니다." });
      }

      //console.log("상대방 정보:", opponentInfo);
      return res.status(200).json({
        nickname: opponentInfo.nickname,
        profile_img: opponentInfo.profile_img || "https://via.placeholder.com/40",
      });

    } catch (error) {
      console.log("상대의 정보를 불러오는 도중 에러 발생:", error);
      res.status(500).json({ message: "Error getting opponent's info", error });
    }
  });

  //추천장소
  router.get("/placeRecommend", async(req, res) => {
    const chatRoomId = new mongoose.Types.ObjectId(req.query.chatRoomId);

    const buyer = await chatService.getBuyerInfo(chatRoomId);
    const seller = await chatService.getSellerInfo(chatRoomId);

    //중간 지점 계산
    const { middleLatitude, middleLongitude } = calculate.calculateMiddlePlace(
      buyer.tradeAddress_latitude, 
      buyer.tradeAddress_longitude,
      seller.tradeAddress_latitude,
      seller.tradeAddress_longitude
    );

    //console.log('중간지점:', middleLatitude, middleLongitude);
    

    //주변 편의시설 보정
    const recommendedPlace = await chatService.getRecommendedPlace(middleLatitude, middleLongitude);
    //console.log(recommendedPlace);

    res.status(200).json(recommendedPlace);
  });

  //메세지 보내기
  router.post("/sendMessage", async(req, res) => {
    const {chatRoomId, senderId, message} = req.body;
    try{
      io.to(chatRoomId).emit('receiveMessage', {senderId, message});

      res.status(200).json({ success: true });
    }catch(error){
      console.error("⚠️메세지를 보내는 도중 에러 발생", error);
      res.status(500).json('error during sending messages', error.message);
    }
  });

  //메세지 가져오기
  router.get("/getMessage", async(req, res) => {
    const chatRoomId = req.query.chatRoomId;

    const messages = await redisService.getChatMessages(chatRoomId);
    res.status(200).json(messages);
  });


  return router;
};