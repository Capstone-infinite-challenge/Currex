//스타트 기말 발표용 목 데이터

import mongoose from 'mongoose';
import connectToDatabase from './configs/mongodb-connection.js'
import Sell from './models/sell.js'; 
import dotenv from 'dotenv';

dotenv.config();
connectToDatabase();


// 대한민국 내에서 랜덤 위도와 경도를 생성하는 함수
function getRandomKoreaLocation() {
    const latitude = (Math.random() * (38.6 - 33.0) + 33.0).toFixed(6); // 33.0 ~ 38.6
    const longitude = (Math.random() * (131.9 - 124.6) + 124.6).toFixed(6); // 124.6 ~ 131.9
    return { latitude, longitude };
}


// 더미 데이터 생성 함수
const createMockSells = async () => {
    try {
        // 기존 데이터 삭제 
        await Sell.deleteMany({});

        // 더미 데이터 생성
        const mockSells = [];
        for (let i = 0; i < 20; i++) { // 1000개의 더미 데이터 생성
            const { latitude, longitude } = getRandomKoreaLocation(); // 랜덤 위치 생성

            mockSells.push({
                name: `Sell_${i+1}`,
                currency: ['JPY', 'USD', 'EUR'][Math.floor(Math.random() * 3)],
                amount: Math.floor(Math.random() * 1000000),
                location: `Location_${i+1}`,
                latitude,
                longitude,
                content: `sellMockData_${i+1}`
            });
        }

        // 데이터 삽입
        await Sell.insertMany(mockSells);
        console.log(`${mockSells.length}개의 판매 데이터 생성 완료`);
    } catch (err) {
        console.error('더미 데이터 생성 중 오류 발생:', err);
    }finally{
        mongoose.connection.close(); // 연결 종료
        console.log('몽고디비 연결종료');
    }
};

// 더미 데이터 생성 실행
createMockSells();