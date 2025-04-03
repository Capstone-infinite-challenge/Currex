import donation from '../models/donation.js';
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
        throw new Error('Cannot find donator info');
    }
};

const getDonationProcessCnt = async(userId) => {
    try{
        const donationCnt = await Donation.aggregate([
            { $match: { userId: userId}},   //해당 userId의 기부만 필터링
            { $group: {_id: "$status", count: {$sum: 1}}}       //상태별 개수 집계
        ]);

        // 결과를 객체 형태로 변환
        const result = {
            registered: 0,
            checked: 0,
            processing: 0,
            finished: 0,
        };

        //집계된 데이터를 result 객체에 매핑
        donationCnt.forEach((doc) => {
            result[doc._id] = doc.count;
        });

        return result;
    }catch(error){
        console.error("Error retreieving donation cnts", error);
        throw new Error('Cannot find donation cnts');
    }
};

const updateDonationProcess = async(donationId) => {
    try{
        const donation = await Donation.findById(donationId);
        
        if (!donation) {
            throw new Error("Donation not found");
        }
        console.log(donation);

        if(donation.status === 'registered'){
            donation.status = 'checked';
        }else if(donation.status === 'checked'){
            donation.status = 'processing';
        }else if(donation.status === 'checked'){
            donation.status = 'finished';
        }
        await Donation.updateOne({_id: donationId}, {$set: { status: donation.status } });

    }catch(error){
        console.error("Error updating donation's process", error);
        throw new Error("Cannot update donation process");
    }
};

export default{
    getUserDonationTotal,
    addRankingInfo,
    getDonationProcessCnt,
    updateDonationProcess
};