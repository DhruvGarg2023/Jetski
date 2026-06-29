import { Router } from 'express';
import { register, login, getProfile } from './auth.controller.js';
import { protect } from '../../middlewares/auth.middleware.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);

// Protected route example
router.get('/profile', protect, getProfile);

export default router;
