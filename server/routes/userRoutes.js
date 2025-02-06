import { findUserInfo, updateAddress } from '../services/userService.js';
import { Router } from 'express';
const router = Router();

//마이페이지
router.get('/mypage', async(req, res) => {
    const userId = req.user.id;
    const userInfo = await findUserInfo(userId);
    res.status(500).json(userInfo);
});


//주소 수정
router.post('/changeAddress', async(req, res) =>{
    const { addr1, addr2, lat, long } = req.body;
    const userId = req.user.id;
    const updatedUserInfo = await updateAddress(userId, addr1, addr2, lat, long);
    res.status(500).json(updatedUserInfo);
});

export default router;