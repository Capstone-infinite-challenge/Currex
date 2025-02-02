import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    loginId: {
        type: String,
        required: true,
        unique: true
    },
    nickname: {
        type: String
    },
    refreshToken: {                 //리프레시 토큰
        type: String,
    },
    refreshTokenExpiresAt: {        //리프레시 토큰 만료시간
        type: Date,             
    }
}, {timestamps: true});

export default mongoose.model('User', userSchema);