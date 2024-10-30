// loanRoutes.js
import express from 'express';
import {
    applyLoan,
    getLoansByType,
    approveLoan,
    managerApproveLoan,
    managerRejectLoan,
    getUserLoans,
    payInstallment,
    getDueInstallments,
    applyPhysicalLoan,
    getLoansByAccountId
} from '../controllers/loanController.js';

const router = express.Router();

router.post('/apply-loan', applyLoan);
router.post('/loan_list', getLoansByType);
router.post('/approve', approveLoan);
router.post('/manager_approve', managerApproveLoan);
router.post('/manager_reject', managerRejectLoan);
router.get('/user-loans', getUserLoans);
router.get('/pay-installment/:loan_id/:installmentId', payInstallment);
router.get('/due-installments/:customer_id', getDueInstallments);
router.post('/phy_loan', applyPhysicalLoan);
router.post('/', getLoansByAccountId);

export default router;
