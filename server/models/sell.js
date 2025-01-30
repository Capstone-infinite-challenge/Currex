import mongoose, { Schema } from "mongoose";

const sellSchema = new Schema({   //스키마 객체 생성
    name: {
        type: String,
        required: true, //필수 필드
    },
    currency: {
        type: String,
        enum: ['JPY', 'USD', 'EUR'],   //값 주어지고 선택하는 방법
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    location: {
        type: String,
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
    images: [
        { // 이미지 데이터 저장 (Binary)                 --나중에 url업로드 방식으로 바꾸는거 고려필요
            data: Buffer,       //이미지 데이터
            contentType: String //이미지 MIME 타입
        }
    ],
    status: {
        type : String,
        enum : ['판매중', '거래중', '거래완료'],
        default: '판매중'
    },
    buyer: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, {timestamps: true});     //이렇게 하면 timestamp 자동으로 추가 가능

export default mongoose.model('Sell', sellSchema);