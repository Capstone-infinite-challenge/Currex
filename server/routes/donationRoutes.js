import { Router } from 'express';
import Donation from '../models/donation.js';
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() });

const router = Router();

//기부 등록
router.post("/dRegi", upload.array('donationImages', 5), async(req, res) => {
    try{
        const donationInfo = {
            name: req.body.name,
            company: req.body.company,
            contact: req.body.contact,
            address: req.body.address,
            images: [] // 이미지 배열 초기화
        };

        if(req.files && req.files.length > 0){
            req.files.forEach(file => {
                donationInfo.images.push({
                    data: file.buffer,
                    contentType: file.mimetype,
                });
            });
        }

        //데이터 유효성 검사
        if(!donationInfo.name){
            return res.status(400).json({error: "이름을 입력해주세요" });
        }else if(!donationInfo.company){
            return res.status(400).json({error: "회사를 입력해주세요"});
        }else if(!donationInfo.contact){
            return res.status(400).json({error: "연락처를 입력해주세요"});
        }else if(!donationInfo.address){
            return res.status(400).json({error: "주소를 입력해주세요"});
        }

        const newDonation = new Donation(donationInfo);
        await newDonation.save();

        res.status(201).json({message: "기부 등록이 완료되었습니다", donation: newDonation});
    }catch(error){
        console.error("에러 발생:", error);
        res.status(500).json({error: "서버 오류가 발생하였습니다."});
    }
})

export default router;