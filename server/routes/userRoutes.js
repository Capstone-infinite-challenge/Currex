import userService from '../services/userService.js';
import { Router } from 'express';
import authenticateToken from '../middleware/authMiddleware.js';

const router = Router();

// 마이페이지 정보 가져오기
router.get('/mypage', authenticateToken, async (req, res) => {
    try {
        const userId = req.user?.id; 
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        const userInfo = await userService.findUserInfo(userId);
        res.status(200).json(userInfo); 
    } catch (error) {
        console.error('Error fetching user info:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// 주소 업데이트
router.put('/changeAddress', authenticateToken, async (req, res) => {
    try {
        const { addr1, addr2, lat, lon } = req.body;
        const userId = req.user.id;

        const updatedUserInfo = await userService.updateAddress(userId, addr1, addr2, lat, lon);
        res.status(200).json({ message: updatedUserInfo }); 
    } catch (error) {
        console.error('Error updating address:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

export default router;