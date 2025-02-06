import mongoose, { Schema } from "mongoose";

// 기존 모델 삭제 (필요한 경우)
if (mongoose.connection.models['User']) {
    delete mongoose.connection.models['User'];
}

const userSchema = new Schema({
    loginId: {
        type: String,
        required: true,
        unique: true
    },
    nickname: {
        type: String
    },
    address: {                      //내주소
        type: String,
        default: null   
    },
    tradeAddress:{                  //거래주소
        type: String,
        default: null
    },
    tradeAddress_latitude:{                  //거래주소 - 경도
        type: String,
        default: null
    },
    tradeAddress_longtitude:{                //거래주소 - 위도
        type: String,
        default: null
    },
    profile_img:{
        type: String
    },
    refreshToken: {                 //리프레시 토큰
        type: String,
    },
    refreshTokenExpiresAt: {        //리프레시 토큰 만료시간
        type: Date,             
    }
}, {timestamps: true});


// 모델 정의
const User = mongoose.model('User', userSchema);

export default User;