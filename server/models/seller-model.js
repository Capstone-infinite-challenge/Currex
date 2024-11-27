import mongoose, { Schema } from "mongoose";

//예시로 일단 만들어놓음
const sellerSchema = new Schema({   //스키마 객체 생성
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
    }
}, {timestamps: true});     //이렇게 하면 timestamp 자동으로 추가 가능

export default mongoose.model('Seller', sellerSchema);