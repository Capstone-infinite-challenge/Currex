import mongoose, { Schema } from "mongoose";

const donationSchema = new Schema({ 
    name: {
        type: String,
        required: true, //필수 필드
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User', // User 스키마와 연결
        required: true,
    },
    company: {
        type: String,
        required: true,        //회사 어떻게 하기로 했더라
    },
    address: {
        type: String,
        required: true,        //일단은 주소 String으로 해놓음
    },
    amount: {  // 추가된 금액 필드
        type: Number,
        required: false,
        default: 0, // 기본값 설정
    },
    contact: {
        type: String,
        required: true,
    },
    donationImages:  [{ 
            data: Buffer,    
            contentType: String 
    }],
    status: {       //기부 상태
        type: String,
        enum: ['registered', 'checked', 'processing', 'finished'],
        default: 'registered', 
    }

}, {timestamps: true});

export default mongoose.model('Donation', donationSchema);