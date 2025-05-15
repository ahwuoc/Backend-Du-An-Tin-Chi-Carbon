import { Router } from 'express';
import FileController from '../controllers/fileController';
import { verifyToken } from '../middleware/authMiddleware';
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() });
const router = Router();

router.post('/upload', verifyToken, upload.single('file'), FileController.uploadFile);

export default router;