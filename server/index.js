import dotenv from 'dotenv'; // Load environment variables
dotenv.config();
import express, { json } from 'express';
import cors from 'cors';
import db from './config/database.js'; // Ensure this file exports a configured database connection

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

// Endpoint to get account by customerId
app.get('/api/accounts', (req, res) => {
    const { customerId } = req.query;
    
    db.query('SELECT accountId FROM accounts WHERE customerId = ?', [customerId], (error, results) => {
        if (error) {
            console.error('Error fetching account data:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'No accounts found for this customer' });
        }

        res.json(results); // Return all accounts related to the customerId
    });
});


// Endpoint to get loans by accountId
app.get('/api/loans', (req, res) => {
    const { accountId } = req.query;
    db.query('SELECT * FROM loans WHERE accountId = ?', [accountId], (error, results) => {
        if (error) {
            console.error('Error fetching loan data:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
        res.json(results);
    });
});

// Endpoint to apply for a loan
app.post('/api/apply-loan', (req, res) => {
    const { accountNo, loanAmount, duration } = req.body;

    // Validate input
    if (!accountNo || !loanAmount || !duration) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    // Call the stored procedure
    db.query(
        'CALL apply_online_loan(?, ?, ?, @loan_status);',
        [accountNo, loanAmount, duration],
        (error, result) => {
            if (error) {
                console.log('Error executing stored procedure:', error);
                return res.status(500).json({ message: 'Internal server error' });
            }
            console.log(result);

            // Now, retrieve the loan status from the output variable
            db.query('SELECT @loan_status AS loan_status;', (err, results) => {
                if (err) {
                    console.error('Error retrieving loan status:', err);
                    return res.status(500).json({ message: 'Internal server error' });
                }

                // Get loan status from the result
                const loanStatus = results[0].loan_status; // This contains the loan status
                res.status(200).json({ message: loanStatus }); // Return the loan status message
            });
        }
    );
});

// Root Endpoint
app.get('/', (req, res) => {
    res.send('Welcome to the Banking API');
});

// Start Server
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}.`);
});