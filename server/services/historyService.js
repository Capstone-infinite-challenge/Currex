import donation from "../models/donation.js";
import Sell from "../models/sell.js";
import User from "../models/user.js";

//나의 환전 목록 불러오기
const getMyExchanges = async(userId) => {
    const status = "거래완료"   //조회의 경우 거래가 완료된 환전만 조회가능
    try{
        const exchangeList = await Sell.find({
            $or: [{ sellerId: userId }, { buyer: userId }],
            status: status            
        })
        .select("amount currency updatedAt sellerId buyer")      //필요한 필드만 선택
        .populate({
            path: "buyer",
            select: "nickname profile_img"  //구매자의 닉네임과 프로필 사진
        })
        .populate({
            path: "sellerId",
            select: "nickname profile_img"
        })
        .lean();

        const formattedList = exchangeList.map(exchange => {
            let opponent = null;
            if (exchange.sellerId._id.toString() === userId.toString()){
                opponent = exchange.buyer;
            }else{
                opponent = exchange.sellerId;
            }

            return{
                amount: exchange.amount,
                currency: exchange.currency,
                exchangeDate: exchange.updatedAt,
                role: exchange.sellerId._id.toString() === userId.toString()? "판매": "구매",
                opponent: opponent? {
                    nickname: opponent.nickname,
                    profile_img: opponent.profile_img
                }: null
            };
        });
        return formattedList;
    }catch(error){
        console.error("Error fetching exchange list:", error);
        throw new Error("환전 목록을 불러오는 도중 에러 발생");
    }
};

const getMyDonations = async(userId) => {
    try{
        const donationList = await donation.find({userId: userId});

        const formattedDonationList = donationList.map(donation => ({
            createdAt: donation.createdAt,
            amount: donation.amount,
            status: donation.status
        }));
        
        return formattedDonationList;
    }catch(error){
        console.error('Error fetching donation list: ', error);
        throw new Error('기부 목록을 불러오는 도중 에러 발생');
    }
};

export default{
    getMyExchanges,
    getMyDonations
};