import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import connectToDatabase from "./configs/mongodb-connection.js";
import Seller from "./models/seller-model.js";

dotenv.config();

const app = express();

app.use(cors());


// req.body와 POST 요청을 해석하기 위한 설정
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//몽고디비 연결
connectToDatabase();


// 라우터
app.use('/auth', authRoutes);


// 변수명
//  currency       // 거래 통화 (jpy, usd)
//  minAmount      // 최소 거래 금액 (외화 기준)
//  maxAmount      // 최대 거래 금액 (외화 기준)
//  exchangeRate   // 환율
//  userLocation   // 거래 희망 위치

// 구매자의 외화 구매 조건
app.post("/buy", (req, res) => {
  try {
    console.log("Request body:", req.body); // 제대로 값이 들어오는지 확인용
    const sellMatchInfoRequest = {
      currency: req.body.currency,
      minAmount: req.body.minAmount,
      maxAmount: req.body.maxAmount,
      userLocation: req.body.userLocation,
      latitude: req.body.latitude,
      longitude: req.body.longitude,
    };

    if (!sellMatchInfoRequest.currency){
        return res.status(400).json({
            error: '금액을 입력해주세요',
        });
    }else if(!sellMatchInfoRequest.minAmount){
        return res.status(400).json({
            error: '최소금액을 입력해주세요',
        });
    }else if(!sellMatchInfoRequest.maxAmount){
        return res.status(400).json({
            error: '최대금액을 입력해주세요',
        });
    }else if(sellMatchInfoRequest.minAmount>sellMatchInfoRequest.maxAmount){
        return res.status(400).json({
            error: '최대금액은 최소금액보다 커야 합니다',
        });
    }
    res.status(201).json(sellMatchInfoRequest);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '서버 오류가 발생했습니다' });
  }
});


//판매자 매칭
app.get("/SellerMatch", async(req, res) => {

  try{
    const { currency, minAmount, maxAmount, userLocation } = req.query;
    const sellers = await Seller.find({
        currency: currency,
        amount: { $gte: Number(minAmount), $lte: Number(maxAmount)},
      });
    
    console.log(sellers);           //값 확인용
    res.status(200).json(sellers);
  }catch(error){
    console.error(error);
    res.status(500).json({error: '서버 오류가 발생했습니다.'});
  }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


export default app;