import { Router } from 'express';

const router = Router();

router.get('/' , (req, res) => {
  res.status(200).json({ message: 'Home' });
});
router.get('/home' , (req, res) => {
  res.status(200).json({ message: 'Home' });
});


export default router;
