import mongoose, { Schema } from "mongoose";

const donationSchema = new Schema({ 
    name: {
        type: String,
        required: true, //필수 필드
    },
    company: {
        type: String,
        required: true,        //회사 어떻게 하기로 했더라
    },
    address: {
        type: String,
        required: true,        //일단은 주소 String으로 해놓음
    },
    contact: {
        type: String,
        required: true,
    },
    donationImages:  [{ 
            data: Buffer,    
            contentType: String 
    }],

}, {timestamps: true});

export default mongoose.model('Donation', donationSchema);