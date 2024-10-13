// routes/accountRoutes.js
import { Router } from 'express';
const router = Router();
import { withdraw, deposit, transfer } from '../controllers/accountController.js';

// Cash Withdraw
router.post('/withdraw', withdraw);

// Deposit
router.post('/deposite', deposit);

// Transfer
router.post('/transfer', transfer);

export default router;
