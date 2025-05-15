import { Router } from 'express';
import PaymentController from '../controllers/paymentController';
import { verifyToken } from '../middleware/authMiddleware';

const router = Router();

router.post('/', verifyToken, PaymentController.createPayment);
router.post('/confirm/:id', verifyToken, PaymentController.confirmPayment);

export default router;