import redisClient from "../configs/redis.js";

//채팅 메세지 저장
const saveChatMessage = async(chatRoomId, senderId, message) => {
    const chatData = JSON.stringify({
        senderId,
        message,
        timestamp: new Date().toISOString(),
    });

    try {
        await redisClient.rPush(`chat:${chatRoomId}`, chatData);
    } catch (error) {
        console.error("메시지 저장 중 오류 발생: ", error);
        throw error; // 오류를 던져서 처리할 수 있도록 함
    }
};

//채팅 메세지들 불러오기
const getChatMessages = async(chatRoomId) => {
    const messages = await redisClient.lRange(`chat:${chatRoomId}`, 0, -1);

    return messages.map((msg) => JSON.parse(msg));      //JSON으로 변환
}

export default {
    saveChatMessage,
    getChatMessages
};