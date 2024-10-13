// routes/authRoutes.js
import { Router } from 'express';
const router = Router();
import { login, employeeLogin } from '../controllers/authController.js';

// Customer login
router.post('/log', login);

// Employee login
router.post('/employeelog', employeeLogin);

export default router;
