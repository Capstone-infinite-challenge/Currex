import Donation from '../models/donation.js';

const getUserDonationTotal = async(userId) => {
    try {
        // 특정 사용자의 해당년도 기부금액 총합 계산
        const currentYear = new Date().getFullYear();   //현재의 연도
        const startOfYear = new Date(`${currentYear}-01-01T00:00:00.000Z`);
        const endOfYear = new Date(`${currentYear}-12-31T23:59:59.999Z`);
        const total = await Donation.aggregate([
            {
                $match: { 
                    userId: userId,
                    updatedAt: {$gte: startOfYear,$lt: endOfYear}
                }
            },
            { $group: { _id: null, totalAmount: { $sum: "$amount" } } } // 금액 총합 계산
        ]);

        console.log(total);
        return total.length > 0 ? total[0].totalAmount : 0; // 결과 반환
    } catch (error) {
        console.error('Error calculating donation total:', error);
        throw new Error('Could not calculate donation total');
    }
};

const addRankingInfo = async(userId) => {
    try{
        const rankDonatorInfo = await Donation.findOne({userId: userId});
        
        //기부내역이 없는 경우
        if(!rankDonatorInfo){
            return{
                d_name: 'Anonymous',
                d_company: 'No Company'
            }
        }
        const donatorInfo = {
            d_name: rankDonatorInfo.name,
            d_company: rankDonatorInfo.company
        }
        return donatorInfo;
    }catch(error){
        console.error('Error retrieving donator Info', error);
        throw new Error('Can not find donator info');
    }
};

export default{
    getUserDonationTotal,
    addRankingInfo
};