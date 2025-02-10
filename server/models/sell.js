import mongoose, { Schema } from "mongoose";

// 최소 1개의 이미지를 요구하는 유효성 검사 함수
function arrayLimit(val) {
    return val.length > 0;  // 배열의 길이가 1 이상인지 확인
}

//User와 1:N
const sellSchema = new Schema({   //스키마 객체 생성
    name: {                     //판매자 닉네임
        type: String,
        required: true, //필수 필드
    },
    sellerId: {                 //판매자 아이디
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    currency: {
        type: String,
        enum: ['JPY', 'USD', 'EUR', 'CNY', 'HKD', 'TWD', 'AUD', 'VND'],   //값 주어지고 선택하는 방법
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    latitude: {
        type: Number,
        required: true,
    },
    longitude: {
        type: Number,
        required: true,
    },
    content: {
        type: String,
        required: false,
    },
    images: {
        type: [
            {
                data: { type: Buffer, required: true },
                contentType: { type: String, required: true }
            }
        ],
        required: true,
        validate: [arrayLimit, "사진을 최소 1장 이상 등록해야합니다."]  //배열 길이 검사 추가
    },
    status: {
        type : String,
        enum : ['판매중', '거래중', '거래완료'],
        default: '판매중'
    },
    buyer: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: null
    }
}, {timestamps: true});     //이렇게 하면 timestamp 자동으로 추가 가능

export default mongoose.model('Sell', sellSchema);