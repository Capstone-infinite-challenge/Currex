import ChatRoom from "../models/chatRoom.js";
import User from "../models/user.js";
import axios from "axios";

//채팅방 생성
const createChatRoom = async(sellId, sellerId, buyerId) => {

    if(!sellerId || !buyerId){
        throw new Error('판매자 또는 구매자 정보를 찾을 수 없습니다.');
    }

    //User모델 찾기
    const seller = await User.findById(sellerId);
    const buyer = await User.findById(buyerId);

    //새로운 채팅방 생성
    const newChatRoom = new ChatRoom({
        chatRoomId: sellId,
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

    console.log('새 채팅방이 생성됨', newChatRoom);
};


const getChatList = async(userId) => {
    try{
        const chatList = await ChatRoom.find({
            $or: [
                { "seller.userId": userId },
                { "buyer.userId": userId }
            ]
        })
        .populate({
            path: "chatRoomId",
            select: "status amount currency"
        })
        .populate({
            path: "seller.userId buyer.userId",
            select: "nickname profile_img"
        })
        .lean();        //JSON 객체로 변환

        //상대방의 프로필 이미지 추가
        const formattedList  = chatList.map(chatRoom => {
            const isSeller = chatRoom.seller.userId._id.toString() === userId.toString();
            return {
                chatRoomId: chatRoom.chatRoomId._id,
                status: chatRoom.chatRoomId?.status,
                amount: chatRoom.chatRoomId?.amount,
                currency: chatRoom.chatRoomId?.currency,
                opponentName : isSeller? chatRoom.buyer.userId.nickname : chatRoom.seller.userId.nickname,
                opponentProfileImg: isSeller?chatRoom.buyer.userId.profile_img : chatRoom.seller.userId.profile_img
            };
        });
        return formattedList;
    }catch(error){
        console.error("Error getting chat list:", error);
        throw error;
    }
};

//chatRoodId로 판매자 구매자 id가져오기
const getChatters = async(chatRoomId) => {
    try{
        const chatRoom = await ChatRoom.findOne({ chatRoomId });

        if(!chatRoom){
            throw new Error('ChatRoom not found');
        }
        const buyerId = chatRoom.buyer.userId;
        const sellerId = chatRoom.seller.userId;

        return {
            buyer: buyerId,
            seller: sellerId
        }
    }catch(error){
        console.error(error);
        throw error;
    }
}

//chatRoomId로 판매자 정보 가져오기
const getBuyerInfo = async(chatRoomId) => {
    try{
        const chatRoom = await ChatRoom.findOne({ chatRoomId });

        if(!chatRoom){
            throw new Error('ChatRoom not found');
        }
        const buyerId = chatRoom.buyer.userId;
        const buyerInfo = await User.findById(buyerId);

        console.log("채팅 판매자 정보 확인", buyerInfo);
        return buyerInfo;
    }catch(error){
        console.error("Error getting buyerInfo:", error);
        throw error;
    }
};

//chatRoomId로 구매자 정보 가져오기
const getSellerInfo = async(chatRoomId) => {
    try{
        const chatRoom = await ChatRoom.findOne({ chatRoomId });

        if(!chatRoom){
            throw new Error('ChatRoom not found');
        }
        const sellerId = chatRoom.seller.userId;
        const sellerInfo = await User.findById(sellerId);

        console.log("채팅 구매자 정보 확인", buyerInfo);
        return sellerInfo;
    }catch(error){
        console.error("Error getting sellerInfo", error);
        throw error;
    }
}


//카카오 위치 보정
const getRecommendedPlace = async(middleLatitude, middleLongitude) => {
    const apiKey = process.env.KAKAO_MAP_KEY;

    //조회할 카테고리
    const categories = ["MT1", "CS2", "SW8", "PO3", "AT4", "CE7"];
    //MT1: 대형마트, CS2: 편의점, SW8: 지하철역, PO3: 공공기관, AT4: 관광명소, CE7: 카페

    try{
        const responses = await Promise.all(         //Promise.all 로 동시에 요청
            categories.map(async(category) => {
                const response = await axios.get(
                    `https://dapi.kakao.com/v2/local/search/category.json`,
                    {
                        headers: {
                            Authorization: `KakaoAK ${apiKey}`,
                            Origin: 'http://127.0.0.1:5000'
                        },
                        params: {
                            category_group_code: category,
                            x: middleLongitude,
                            y: middleLatitude,
                            radius: 10000,  //반경 10km
                            sort: "distance",   //거리순 정렬
                        },
                    }
                );
                return response.data.documents;       //결과 데이터만 반환
            })
        );
        //모든 결과를 하나의 배열로 합치기
        const allPlaces = responses.flat();

        //거리 순으로 정렬 후 가장 가까운 장소 반환
        const nearestPlace = allPlaces.sort((a, b) => a.distance - b.distance)[0];
        return nearestPlace || null;
        
    }catch(error){
        console.log("Error recommending places:", error);
        return null;
    }
};


export default{
    createChatRoom,
    getChatList,
    getBuyerInfo,
    getSellerInfo,
    getChatters,
    getRecommendedPlace
};