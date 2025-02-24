import mongoose, { Schema } from "mongoose";

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

export default ChatRoom;