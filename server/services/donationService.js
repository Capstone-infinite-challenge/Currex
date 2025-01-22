import Donation from '../models/donation.js';

async function getUserDonationTotal(userId) {
    try {
        // 특정 사용자의 모든 기부내역 금액 총합 계산
        const total = await Donation.aggregate([
            { $match: { userId: userId } }, // 특정 사용자의 데이터만 필터링
            { $group: { _id: null, totalAmount: { $sum: "$amount" } } } // 금액 총합 계산
        ]);

        return total.length > 0 ? total[0].totalAmount : 0; // 결과 반환
    } catch (error) {
        console.error('Error calculating donation total:', error);
        throw new Error('Could not calculate donation total');
    }
}

export {
    getUserDonationTotal
};