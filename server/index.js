// index.js
import dotenv from 'dotenv'; // Load environment variables
dotenv.config();
import express, { json } from 'express';
import cors from 'cors';

const app = express();

// Middleware
app.use(cors());
app.use(json());

// Routes
import authRoutes from './routes/authRoutes.js';
import accountRoutes from './routes/accountRoutes.js';
import customerRoutes from './routes/customerRoutes.js';
import employeeRoutes from './routes/employeeRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';

// Use Routes
app.use('/auth', authRoutes);
app.use('/account', accountRoutes);
app.use('/customer', customerRoutes);
app.use('/employee', employeeRoutes);
app.use('/transaction', transactionRoutes);

// Root Endpoint
app.get('/', (req, res) => {
    res.send('Welcome to the Banking API');
});

// Start Server
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}.`);
});
