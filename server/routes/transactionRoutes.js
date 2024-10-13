// routes/transactionRoutes.js
import { Router } from 'express';
const router = Router();
import { getTransactionDetails, getTransactionReport, fixDeposit } from '../controllers/transactionController.js';

// Transaction Details
router.get('/trans_detail', getTransactionDetails);

// Transaction Report
router.post('/trans_report', getTransactionReport);

// Fixed Deposit
router.post('/fixdepo', fixDeposit);

export default router;
