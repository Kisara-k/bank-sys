// routes/employeeRoutes.js
import { Router } from 'express';
const router = Router();
import { insertEmployee } from '../controllers/employeeController.js';

// Insert Employee
router.post('/insertEmployee', insertEmployee);

export default router;
