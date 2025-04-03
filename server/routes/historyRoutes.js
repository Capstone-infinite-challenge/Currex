import { Router } from 'express';
import historyService from "../services/historyService.js";
import userService from '../services/userService.js';

const router = Router();

router.get('/exchange', async(req, res) => {
    const user = await userService.findUserInfo(req.user.id);
    const userId = user.id;
    const myExchanges = await historyService.getMyExchanges(userId);

    return res.status(200).json(myExchanges);
});

router.get('/donations', async(req, res) => {
    const userId = (await userService.findUserInfo(req.user.id)).id
    const myDonations = await historyService.getMyDonations(userId);

    return res.status(200).json(myDonations);
});


export default router;