import { Router } from "express";
import Donation from "../models/donation.js";
import multer from "multer";
import donationService from "../services/donationService.js";
import userService from "../services/userService.js";
import redisService from "../services/redisService.js";

const upload = multer({ storage: multer.memoryStorage() });

const router = Router();

//기부 등록
router.post("/dRegi", upload.array("donationImages", 5), async (req, res) => {
  try {
    const userId = req.user.id;
    //userId objectId로 변경
    const donationUser = (await userService.findUserInfo(userId)).id;

    const donationInfo = {
      name: req.body.name,
      userId: donationUser,
      company: req.body.company,
      contact: req.body.contact,
      address: req.body.address,
      amount: req.body.amount,
      images: [], // 이미지 배열 초기화
    };

    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        donationInfo.images.push({
          data: file.buffer,
          contentType: file.mimetype,
        });
      });
    }

    //데이터 유효성 검사
    if (!donationInfo.name) {
      return res.status(400).json({ error: "이름을 입력해주세요" });
    } else if (!donationInfo.company) {
      return res.status(400).json({ error: "회사를 입력해주세요" });
    } else if (!donationInfo.contact) {
      return res.status(400).json({ error: "연락처를 입력해주세요" });
    } else if (!donationInfo.address) {
      return res.status(400).json({ error: "주소를 입력해주세요" });
    } else if (!donationInfo.amount) {
      return res.status(400).json({ error: "금액을 입력해주세요" });
    }

    const newDonation = new Donation(donationInfo);
    await newDonation.save();

    await redisService.saveDonation(userId, donationInfo.amount);

    res
      .status(201)
      .json({ message: "기부 등록이 완료되었습니다", donation: newDonation });
  } catch (error) {
    console.error("에러 발생:", error);
    res.status(500).json({ error: "서버 오류가 발생하였습니다." });
  }
});

//기부 랭킹위에 기부 누적금액 api
router.get("/total", async (req, res) => {
  try {
    const userId = (await userService.findUserInfo(req.user.id)).id;
    const total = await donationService.getUserDonationTotal(userId);
    res.json({ userId, totalAmount: total });
  } catch (error) {
    console.log("기부총합계산중 에러 발생", error);
    res.status(500).json({ error: "Failed to fetch total donations" });
  }
});

//기부 랭킹
router.get("/rank", async (req, res) => {
  try {
    const rankInfo = await redisService.getDonationRanking(20);

    const formattedRankInfo = await Promise.all(
      rankInfo.map(async (donation) => {
        const userId = (await userService.findUserInfo(donation.userId)).id;
        const donationRankInfo = await donationService.addRankingInfo(userId);
        return {
          rank: donation.rank,
          userId: donation.userId,
          totalDonation: donation.totalDonation,
          d_name: donationRankInfo.d_name,
          d_company: donationRankInfo.d_company,
        };
      })
    );
    res.status(200).json(formattedRankInfo);
  } catch (error) {
    console.log("에러: ", error);
    res
      .status(500)
      .json({ error: "랭킹을 불러오는 도중 에러가 발생하였습니다." });
  }
});

//기부 상태별 개수 반환 라우터
router.get("/donationProcess", async (req, res) => {
  try {
    const userId = (await userService.findUserInfo(req.user.id)).id;
    const donationCnts = await donationService.getDonationProcessCnt(userId);

    res.status(200).json(donationCnts);
  } catch (error) {
    console.log("에러: ", error);
    res
      .status(500)
      .json({ error: "프로세스 별 기부 수를 불러오는 도중 에러 발생" });
  }
});

// 기부 상태 변경 라우터(admin 사용자용)
router.post("/donationProcess/:donationId", async (req, res) => {
  try {
    const { donationId } = req.params;
    await donationService.updateDonationProcess(donationId);

    res.status(200).json({ success: "성공적으로 기부 상태를 변경하였습니다." });
  } catch (error) {
    console.log("에러: ", error);
    res
      .status(500)
      .json({ error: "관리자: 기부 상태를 업데이트 하는 도중 에러 발생" });
  }
});

export default router;
