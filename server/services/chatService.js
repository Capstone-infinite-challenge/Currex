import ChatRoom from "../models/chatRoom.js";
import User from "../models/user.js";

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
    await seller.save();

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


//chatRoomId로 판매자 정보 가져오기
const getBuyerInfo = async(chatRoomId) => {
    try{
        const buyerId = (await ChatRoom.findById(chatRoomId)).buyer.userId;
        const buyerInfo = await User.findById(buyerId);
        return buyerInfo;
    }catch(error){
        console.error("Error getting buyerInfo:", error);
        throw error;
    }
};

//chatRoomId로 구매자 정보 가져오기
const getSellerInfo = async(chatRoomId) => {
    try{
        const sellerId = (await ChatRoom.findById(chatRoomId)).seller.userId;
        const sellerInfo = await User.findById(sellerId);
        return sellerInfo;
    }catch(error){

    }
}


export default{
    createChatRoom,
    getChatList,
    getBuyerInfo,
    getSellerInfo
};