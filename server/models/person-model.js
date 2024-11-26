import mongoose, { Schema } from "mongoose";

//예시로 일단 만들어놓음
const personSchema = new Schema({   //스키마 객체 생성
    name: String,
    age: Number,
    email: {type: String, required: true},
});

export default mongoose.model('Person', personSchema);