import User from "../models/user.js";

// sellerId로 사용자 찾아서 사용자 정보 반환하는 함수
const findSellerInfo = async(sellerId) => {
    try{
        const seller = await User.findById(sellerId);
        
        return seller; 
    }catch(error){
        console.log(error);
        throw new Error('판매자 정보를 불러오는 데 실패하였습니다.')
    }
};


export default {
    findSellerInfo
};