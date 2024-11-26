import express from 'express';
import mongoClient from './configs/mongodb-connection.js';

const app = express();

//req.body와 POST 요청을 해석하기 위한 설정
app.use(express.json());
app.use(express.urlencoded({extended: true}));


//라우터

//변수명
//  currency. // 거래 통화 (jpy usd)
//  minAmount      // 최소 거래 금액 (외화 기준)
//  maxAmount      // 최대 거래 금액 (외화기준)
//  exchangeRate   // 환율
//  userLocation   // 거래 희망 위치

//구매자의 외화 구매 조건
app.post('/', (req, res) => {
    try{
        console.log("Request body:", req.body);         //제대로 값이 들어오는지 확인용
        const sellMatchInfoRequest = {
            currency : req.body.currency,
            KRW_minAmount : req.body.KRW_minAmount,
            KRW_maxAmount : req.body.KRW_maxAmount,
            userLocation : req.body.userLocation
        }

        if (!sellMatchInfoRequest.currency || !sellMatchInfoRequest.KRW_minAmount || !sellMatchInfoRequest.KRW_maxAmount) {
            return res.status(400).json({
              error: '모든 필드를 작성해야합니다',
            });
        }

        res.status(201).json(sellMatchInfoRequest);
    }catch(error){
        console.error(error);

    }
});


//판매자 매칭
//app.get('/SellerMatch', (req, res) => {

//})