import ChatRoom from "../models/chatRoom.js";
import User from "../models/user.js";
import axios from "axios";
import redisClient from "../configs/redis.js";

//채팅방 생성
const createChatRoom = async (sellId, sellerId, buyerId) => {
  if (!sellerId || !buyerId) {
    throw new Error("판매자 또는 구매자 정보를 찾을 수 없습니다.");
  }

  // 중복 방지 로직 추가
  const existingRoom = await ChatRoom.findOne({ chatRoomId: sellId });
  if (existingRoom) {
    console.log("이미 존재하는 채팅방입니다.");
    return res.status(200).json(existingRoom);
  }

  //User모델 찾기
  const seller = await User.findById(sellerId);
  const buyer = await User.findById(buyerId);

  //새로운 채팅방 생성
  const newChatRoom = new ChatRoom({
    chatRoomId: sellId,
    sellId: sellId,
    seller: {
      userId: sellerId,
    },
    buyer: {
      userId: buyerId,
    },
  });

  await newChatRoom.save();

  //User 모델에 연결
  seller.chatRooms.push(newChatRoom._id);
  buyer.chatRooms.push(newChatRoom._id);

  await seller.save();
  await buyer.save();

  console.log("새 채팅방이 생성됨", newChatRoom);
};

const getChatList = async (userId) => {
  try {
    const chatList = await ChatRoom.find({
      $or: [{ "seller.userId": userId }, { "buyer.userId": userId }],
    })
      .populate({
        path: "chatRoomId",
        select: "status amount currency _id",
      })
      // .populate({
      //     path: "seller.userId buyer.userId",
      //     select: "nickname profile_img"
      // })
      .populate({
        path: "seller.userId",
        select: "nickname profile_img",
      })
      .populate({
        path: "buyer.userId",
        select: "nickname profile_img",
      })
      .lean(); //JSON 객체로 변환

        //상대방의 프로필 이미지 추가
        const formattedList  = chatList.map(chatRoom => {
            const isSeller = chatRoom.seller?.userId?._id?.toString() === userId.toString();
            return {
                chatRoomId: chatRoom.chatRoomId._id,
                sellId: chatRoom.chatRoomId._id,  
                status: chatRoom.chatRoomId?.status,
                amount: chatRoom.chatRoomId?.amount,
                currency: chatRoom.chatRoomId?.currency,
                opponentName : isSeller? chatRoom.buyer?.userId.nickname : chatRoom.seller?.userId.nickname,
                opponentProfileImg: isSeller?chatRoom.buyer.userId.profile_img : chatRoom.seller.userId.profile_img,
                lastMessageTime: 0 // 기본값 0으로 설정
            };
        });

    //Redis에서 최신 메세지 시간 조회
    const chatListByTimestamps = await Promise.all(
      formattedList.map(async (chatRoom) => {
        const chatRoomId = chatRoom.chatRoomId;

        const lastMessage = await redisClient.lRange(
          `chat:${chatRoomId}`,
          -1,
          -1
        );

        let lastMessageTime = 0; //lastMessage시간 저장 변수 초기화
        if (lastMessage.length > 0) {
          try {
            const messageObj = JSON.parse(lastMessage[0]);
            lastMessageTime = new Date(messageObj.timestamp).getTime() || 0; //시간으로 변환해야 비교 가능
          } catch (error) {
            console.error(
              `Error parsing message for chat:${chatRoomId}`,
              error
            );
          }
        }

        return {
          ...chatRoom,
          lastMessageTime,
        };
      })
    );
    //최신 메세지 기준으로 정렬
    chatListByTimestamps.sort((a, b) => b.lastMessageTime - a.lastMessageTime);

    return chatListByTimestamps;
  } catch (error) {
    console.error("Error getting chat list:", error);
    throw error;
  }
};

//chatRoomId로 판매자 구매자 id가져오기
const getChatters = async (chatRoomId) => {
  try {
    const chatRoom = await ChatRoom.findOne({ chatRoomId });

    if (!chatRoom) {
      throw new Error("ChatRoom not found");
    }
    const buyerId = chatRoom.buyer.userId;
    const sellerId = chatRoom.seller.userId;

    return {
      buyer: buyerId,
      seller: sellerId,
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

//chatRoomId로 판매자 정보 가져오기
const getBuyerInfo = async (chatRoomId) => {
  try {
    const chatRoom = await ChatRoom.findOne({ chatRoomId });

    if (!chatRoom) {
      throw new Error("ChatRoom not found");
    }
    const buyerId = chatRoom.buyer.userId;
    const buyerInfo = await User.findById(buyerId);

    console.log("채팅 판매자 정보 확인", buyerInfo);
    return buyerInfo;
  } catch (error) {
    console.error("Error getting buyerInfo:", error);
    throw error;
  }
};

//chatRoomId로 구매자 정보 가져오기
const getSellerInfo = async (chatRoomId) => {
  try {
    const chatRoom = await ChatRoom.findOne({ chatRoomId });

    if (!chatRoom) {
      throw new Error("ChatRoom not found");
    }
    const sellerId = chatRoom.seller.userId;
    const sellerInfo = await User.findById(sellerId);

    console.log("채팅 구매자 정보 확인", sellerInfo);
    return sellerInfo;
  } catch (error) {
    console.error("Error getting sellerInfo", error);
    throw error;
  }
};

//카카오 위치 보정
const getRecommendedPlace = async (middleLatitude, middleLongitude) => {
  const apiKey = process.env.KAKAO_MAP_KEY;

  //조회할 카테고리
  const categories = ["MT1", "CS2", "SW8", "PO3", "AT4", "CE7"];
  //MT1: 대형마트, CS2: 편의점, SW8: 지하철역, PO3: 공공기관, AT4: 관광명소, CE7: 카페

  try {
    const responses = await Promise.all(
      //Promise.all 로 동시에 요청
      categories.map(async (category) => {
        const response = await axios.get(
          `https://dapi.kakao.com/v2/local/search/category.json`,
          {
            headers: {
              Authorization: `KakaoAK ${apiKey}`,
              Origin: "http://127.0.0.1:5000",
            },
            params: {
              category_group_code: category,
              x: middleLongitude,
              y: middleLatitude,
              radius: 10000, //반경 10km
              sort: "distance", //거리순 정렬
            },
          }
        );
        return response.data.documents; //결과 데이터만 반환
      })
    );
    //모든 결과를 하나의 배열로 합치기
    const allPlaces = responses.flat();

    //거리 순으로 정렬 후 가장 가까운 장소 반환
    const nearestPlace = allPlaces.sort((a, b) => a.distance - b.distance)[0];
    return nearestPlace || null;
  } catch (error) {
    console.log("Error recommending places:", error);
    return null;
  }
};

//해당 sellId의 내가 속한 채팅방이 있는 지 확인
const findChatRoom = async (sellId, buyerId) => {
  try {
    const chatRoom = await ChatRoom.findOne({
      chatRoomId: sellId,
      "buyer.userId": buyerId,
    });

    return chatRoom !== null;
  } catch (error) {
    console.error("Error checking chat room", error);
    return false;
  }
};

//해당 sellId를 가진 chatRoom이 있는 지 확인
const findChatRoomById = async(sellId) => {
  try{
    const chatRoom = await ChatRoom.findOne({ chatRoomId: sellId });
    return chatRoom !== null;
  }catch(error){
    console.error("Error checking while existing chat room", error);
    return false;
  }
}

export default {
  createChatRoom,
  getChatList,
  getBuyerInfo,
  getSellerInfo,
  getChatters,
  getRecommendedPlace,
  findChatRoom,
  findChatRoomById
};
