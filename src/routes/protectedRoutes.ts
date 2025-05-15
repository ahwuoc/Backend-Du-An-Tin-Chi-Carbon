import { Router } from 'express';
import { verifyToken, hasRole } from '../middleware/authMiddleware';

const router = Router();

// Admin-only route
router.get('/admin', verifyToken, hasRole(['admin']), (req, res) => {
  res.status(200).json({ message: 'Admin access granted' });
});


// Staff-only route
router.get('/staff', verifyToken, hasRole(['staff']), (req, res) => {
  res.status(200).json({ message: 'Staff access granted' });
});

// User and Admin can access
router.get('/user', verifyToken, hasRole(['user', 'admin', 'staff']), (req, res) => {
  res.status(200).json({ message: 'User dashboard' });
});

router.get('/users' , (req, res) => {
  res.status(200).json({ message: 'User dashboard1' });
});

export default router;
