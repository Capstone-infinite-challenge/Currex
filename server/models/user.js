import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    loginId: {
        type: String,
        required: true,
        unique: true
    },
    nickname: {
        type: String
    }
}, {timestamps: true});

export default mongoose.model('User', userSchema);