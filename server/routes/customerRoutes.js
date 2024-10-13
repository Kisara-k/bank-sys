// routes/customerRoutes.js
import { Router } from 'express';
const router = Router();
import { createAccount } from '../controllers/customerController.js';

// Create Account
router.post('/createAcc', createAccount);

export default router;
