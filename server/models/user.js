import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    loginId: {
        type: String,
        required: true,
        unique: true
    },
    nickname: {
        type: String,
        //required: true,  이게 필수적인거였나???
    },
    password:{
        type: String,
        required: false
    }
}, {timestamps: true});

export default mongoose.model('User', userSchema);