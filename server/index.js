import dotenv from 'dotenv'; // Load environment variables
dotenv.config();
import express, { json } from 'express';
import cors from 'cors';

import db from './config/database.js'; // Ensure this file exports a configured database connection

import jwt from 'jsonwebtoken';

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
import loanRoutes from './routes/loanRoutes.js';

// Use Routes
app.use('/auth', authRoutes);
app.use('/account', accountRoutes);
app.use('/customer', customerRoutes);
app.use('/employee', employeeRoutes);
app.use('/transaction', transactionRoutes);
app.use('/loans', loanRoutes);

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



// Root Endpoint
app.get('/', (req, res) => {
    res.send('Welcome to the Banking API');
});

// Start Server
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}.`);
});


app.post("/viewinfo",(req,res)=>{
    const number=req.body.no;
    const viewOption=req.body.viewOption;
    console.log(number,viewOption);
    if(viewOption==="2"){
        const nic=`CALL detail_nic(?)`;
        db.execute(nic,
            [number],
            (err,result)=>{
                if(err){
                    console.log("error getting data ",err);
                    res.send({success:0});
                    return;
                }
                console.log(result);
                res.send({success:2,outcome:result});
            }
        )
    }
    else if(viewOption==="3"){
        const nic=`CALL detail_reg_no(?)`;
        db.execute(nic,
            [number],
            (err,result)=>{
                if(err){
                    console.log("error getting data ",err);
                    res.send({success:0});
                    return;
                }
                console.log(result);
                res.send({success:3,outcome:result});
            }
        )
    }else if(viewOption==="1"){
        const nic=`CALL detail_acc_no(?)`;
        db.execute(nic,
            [number],
            (err,result)=>{
                if(err){
                    console.log("error getting data ",err);
                    res.send({success:0});
                    return;
                }
                console.log(result[0]);
                res.send({success:1,outcome:result});
            }
        )
    }

})




app.get('/user-loans', (req, res) => {
    const customer_id = req.query.customer_id;
  
    if (!email) {
      return res.status(400).send({ message: 'Customer_id is required' });
    }
  
    db.execute("SELECT * FROM loans WHERE customer_id = ?", [customer_id], (err, result) => {
      if (err) {
        console.log("Error getting loan details:", err);
        return res.status(500).send({ message: 'Error getting loan details' });
      }
  
      // Assuming you have a way to get installments for each loan
      const loansWithInstallments = result.map(loan => {
        // Fetch installments for each loan
        const installments = db.execute("SELECT * FROM installments WHERE loan_id = ?", [loan.loan_id]);
        return { ...loan, installments };
      });
  
      res.send(loansWithInstallments);
    });
  });

// Middleware to verify JWT and extract customer_id
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.sendStatus(403);

    jwt.verify(token, 'yourSecretKey', (err, decoded) => {
        if (err) return res.sendStatus(403);
        req.customer_id = decoded.customer_id; // Assuming customer_id is stored in the token
        next();
    });
};