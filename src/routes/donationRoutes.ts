import { Router } from 'express';
import DonationController from '../controllers/donationController';
import { verifyToken } from '../middleware/authMiddleware';

const router = Router();

router.post('/', verifyToken, DonationController.createDonation);
router.get('/trees', DonationController.getTrees);
router.get('/contributors', DonationController.getContributors);

export default router;