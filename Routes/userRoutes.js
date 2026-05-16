import express from 'express';

import { register, login } from '../Controllers/user.js';
import rateLimit from 'express-rate-limit';
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: { message: 'Too many attempts, please try again later' },
});

const router = express.Router();

router.post('/register',authLimiter, register);

router.post('/login',authLimiter, login);

export default router;
