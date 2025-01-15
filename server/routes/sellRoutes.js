import { Router } from 'express';
import multer from 'multer'; // 파일 업로드 미들웨어
import Sell from '../models/sell.js';

// Multer 설정: 파일 메모리 저장
const upload = multer({ storage: multer.memoryStorage() });

const router = Router();


//판매 등록 페이지
router.post("/productRegi", upload.array('images', 5), async(req, res) => {

    try{
        //프론트에서 입력 정보 받아오기
        const sellInfo = {
            currency: req.body.currency,
            amount: req.body.amount,
            sellerLocation: req.body.sellerLocation,
            latitude: req.body.latitude,
            longitude: req.body.longitude,
            content: req.body.content
        };

        //사용자 정보 받아오기
        sellInfo.name = req.user.name; // 로그인 사용자 이름 추가 - 로그인정보 어떻게 받아올지...?

        //파일 저장하기
        if (req.files && req.files.length > 0) {
            req.files.forEach(file => {
                sellInfo.images.push({
                    data: file.buffer,
                    contentType: file.mimetype,
                });
            });
        }

        // 데이터 유효성 검사
        if (!sellInfo.currency) {
            return res.status(400).json({ error: "통화를 입력해주세요" });
        } else if (!sellInfo.amount) {
            return res.status(400).json({ error: "금액을 입력해주세요" });
        }

        
        //데이터베이스에 seller 정보 저장하기
        const newSell = new Sell(sellInfo);
        await newSell.save();

        res.status(201).json({ message: "판매 등록이 완료되었습니다", sell: newSell });
    }catch(error){
        console.error("에러 발생:", error);
        res.status(500).json({ error: "서버 오류가 발생했습니다" });
    }
});


// 판매자 화면 페이지 - 각 판매 데이터 상세
router.get('/sellDescription/:sellId', async(req, res) => {
    try{
        const sell = await Sell.findById(req.params.id);
        if(!sell){
            return res.status(404).json({message: 'Sell not found'});
        }
        res.json(sell);
    }catch(error){
        res.status(500).json({error: error.message});
    }
});



export default router;