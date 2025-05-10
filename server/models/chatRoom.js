import mongoose, { Schema } from "mongoose";
import User from "./user.js";

const chatRoomSchema = new Schema({
    chatRoomId: {
        type: Schema.Types.ObjectId,
        ref: 'Sell',
        required: true,
        unique: true
    },
    seller: {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    },
    buyer: {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    }
});

const ChatRoom = mongoose.model('ChatRoom', chatRoomSchema);

// ChatRoom 삭제 시 seller와 buyer에서 chatRoom 삭제
async function deleteChatRoomAndUpdateUsers(chatRoomId) {
    const chatRoom = await ChatRoom.findById(chatRoomId);
    if(chatRoom) {
        //chatRoom 참조하고 있는 seller와 buyer에서 해당 chatRoom 제거
        await User.updateMany(
            { _id: { $in: chatRoom.users }},
            { $pull: { chatRooms: chatRoomId }}
        );

        //실제 chatRoom 삭제
        await chatRoom.remove();
    }
}

export default ChatRoom;