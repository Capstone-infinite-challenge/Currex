//스타트 기말 발표용 목 데이터

import mongoose from 'mongoose';
import connectToDatabase from './configs/mongodb-connection.js'
import Seller from './models/seller-model.js'; 
import dotenv from 'dotenv';

dotenv.config();
connectToDatabase();

// 더미 데이터 생성 함수
const createMockSellers = async () => {
    try {
        // 기존 데이터 삭제 
        await Seller.deleteMany({});

        // 더미 데이터 생성
        const mockSellers = [];
        for (let i = 0; i < 10; i++) { // 1000개의 더미 데이터 생성
            mockSellers.push({
                name: `Seller_${i}`,
                currency: ['JPY', 'USD', 'EUR'][Math.floor(Math.random() * 3)],
                amount: Math.floor(Math.random() * 1000000),
            });
        }

        // 데이터 삽입
        await Seller.insertMany(mockSellers);
        console.log(`${mockSellers.length}개의 판매자 데이터 생성 완료`);
    } catch (err) {
        console.error('더미 데이터 생성 중 오류 발생:', err);
    }finally{
        mongoose.connection.close(); // 연결 종료
        console.log('몽고디비 연결종료');
    }
};

// 더미 데이터 생성 실행
createMockSellers();