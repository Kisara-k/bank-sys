// index.js
import dotenv from 'dotenv'; // Load environment variables
dotenv.config();
import express, { json } from 'express';
import cors from 'cors';
import db from './config/database.js';

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


// Endpoint to apply for an online loan
app.post('/apply-loan', (req, res) => {
    const { accountNo, loanAmount, duration } = req.body;

    // Validate input
    // if (!accountNo || !requested_loan_amount || !duration) {
    //     return res.status(400).json({ message: 'Missing required fields' });
    // }

    const loanStatus = {};

    // Call the stored procedure
    db.query(
        'CALL apply_online_loan(?, ?, ?, @loan_status);',
        [accountNo, loanAmount, duration],
        (error,result) => {
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


app.post("/phy_loan",(req,res)=>{
    const acc_no=req.body.acc_no;
    const amount=req.body.amount;
    const duration=req.body.duration;
    const date=req.body.date;

    const physical_loan=`CALL physical_loan(?,?,?,?,@loan_state)`;

    db.execute(physical_loan,[
        amount,acc_no,duration,date
    ],(err,result)=>{
        if(err){
            console.log("procedure error.",err);
            return res.status(500).json({ message: 'Internal server error' });
        }
        console.log(result);
        db.query("SELECT @loan_state AS state",(err,result)=>{
            if(err){
                console.log("error of fetching status",err);
                return res.status(500).json({ message: 'Internal server error' });
            }
            const status=result[0].status;
            res.send({success:1});
            console.log("success");
        })
    })
})

