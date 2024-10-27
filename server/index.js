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
app.post('/loans', (req, res) => {
    const accountId=req.body.accountId;

    db.query('SELECT * FROM loans WHERE account_id = ?', [accountId], (error, results) => {
        if (error) {
            console.error('Error fetching loan data:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
        res.send(results);
        
    });
});

// Endpoint to apply for a loan
app.post('/apply-loan', (req, res) => {
    const { accountNo, loanAmount, duration, loanReason } = req.body;

    // Validate input
    if (!accountNo || !loanAmount || !duration || !loanReason) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    // Get token from headers
    const token = req.headers.authorization?.split(' ')[1]; // Ensure token format is "Bearer <token>"
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    // Decode token to get user ID
    let userId;
    try {
        const decodedToken = jwt.verify(token, 'yourSecretKey'); // Replace 'yourSecretKey' with your actual secret key
        userId = decodedToken.userId; // Ensure you use the same key you used when signing the token
    } catch (err) {
        console.log('Invalid token:', err);
        return res.status(401).json({ message: 'Invalid token' });
    }

    // Check if the user is the owner of the account
    db.query(
        'SELECT account.customer_id FROM account JOIN fixed_deposit ON fixed_deposit.account_id = account.account_id WHERE fixed_deposit.fd_id = ?',
        [accountNo],
        (error, results) => {
            console.log('Results:', results);
            if (error) {
                console.log('Database error:', error);
                return res.status(500).json({ message: 'Internal server error' });
            }

            if (results.length === 0 || results[0].customer_id !== userId) {
                return res.status(403).json({ message: 'Unauthorized: Account owner mismatch' });
            }

            // Call the stored procedure to apply for the loan
            db.query(
                'CALL apply_online_loan(?, ?, ?, ?, @loan_status);',
                [accountNo, loanAmount, duration, loanReason],
                (error, result) => {
                    if (error) {
                        console.log('Error executing stored procedure:', error);
                        return res.status(500).json({ message: 'Internal server error' });
                    }

                    // Retrieve the loan status from the output variable
                    db.query('SELECT @loan_status AS loan_status;', (err, results) => {
                        if (err) {
                            console.error('Error retrieving loan status:', err);
                            return res.status(500).json({ message: 'Internal server error' });
                        }

                        // Get loan status from the result
                        const loanStatus = results[0].loan_status;
                        res.status(200).json({ message: loanStatus });
                    });
                }
            );
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
});

app.post("/loan_list",(req,res)=>{
    const type=req.body.type;
    console.log(type);
    if(type==="1"){
        db.execute(`SELECT * FROM loans WHERE type="online"`,
            (err,result)=>{
                if(err){
                    console.log("error getting loan details");
                    return;
                }
                console.log(result);
                res.send(result);
                
            }
        );
    }
    else if(type==="2"){
        db.execute("SELECT * FROM loans WHERE type='physical'",
            (err,result)=>{
                if(err){
                    console.log("error getting loan details");
                    return;
                }
                res.send(result);
                
            }
        );
    }
    else if(type==="3"){
        db.execute("SELECT * FROM loans WHERE type='physical' AND status='pending'",
            (err,result)=>{
                if(err){
                    console.log("error getting loan details");
                    return;
                }
                res.send(result);
                
            }
        );
    }
    
});

app.post("/approve",(req,res)=>{
    const loan_id=req.body.loan_id;
    console.log(loan_id);
    db.execute(`SELECT * FROM loans  WHERE loan_id=? AND loans.type="physical" AND loans.status="pending"`,
        [loan_id],
        (err,result)=>{
            if(err){
                console.log("error executing ",err);
                return;
            }
            res.send(result);
            console.log(result);
        }
    )
});

app.post("/manager_approve",(req,res)=>{
    const loan_id=req.body.loan_id;
    const acc_id=req.body.acc_id;
    const manager_id=req.body.manager_id;
    console.log(loan_id,acc_id,manager_id);
    const manager_apply=`CALL approve_loan(?,?,?,@status)`
    db.execute(manager_apply,
        [acc_id,loan_id,manager_id],
        (err,result)=>{
            if(err){
                console.log("error procedure call",err);
                res.send({success:0,message:"loan approve error!"});
                return;
            }
            console.log(result);
            db.query("SELECT @status AS status",(err,result)=>{
                if(err){
                    console.log("error of fetching status",err);
                    return;
                }
                const status=result[0].status;

                if(status===1){
                    res.send({success:1,message:"loan approve completed"});
                }

            })
        }
    )
});

app.post("/manager_reject",(req,res)=>{
    const loan_id=req.body.loan_id;
    const manager_id=req.body.manager_id;
    const acc_id=req.body.acc_id;
    console.log(acc_id,loan_id,manager_id);
    const reject_loan=`CALL reject_loan(?,?,?,@status)`;
    db.execute(reject_loan,
        [loan_id,manager_id,acc_id],
        (err,result)=>{
            if(err){
                console.log("error executing procedure",err);
                res.send({success:0,message:"loan reject error!"});
                return;
            }
            console.log(result);
            db.query("SELECT @status AS status",(err,result)=>{
                if(err){
                    console.log("error fetching status",err);
                    return;
                }
                const status=result[0].status;
                if(status===1){
                    res.send({success:1,message:"loan reject completed"});
                }
            })
        }
    )
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

app.get('/loans/due-installments/:customer_id', (req, res) => {
    const customer_id = req.params.customer_id; // Get customer_id from route parameters

    // Call the stored procedure to fetch due installments
    const sql = 'CALL get_due_installments(?)'; // Update this according to your stored procedure

    db.query(sql, [customer_id], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database error' });
        }

        // The first result set from the procedure contains the installments
        const installments = results[0]; // Extract the first element
        console.log(installments);

        // Check if installments is an array and send response
        if (Array.isArray(installments)) {
            res.json(installments);
        } else {
            res.status(404).json({ error: 'No installments found' });
        }
    });
});




app.get('/pay-installment/:loan_id/:installmentId', (req, res) => {
    const loan_id = req.params.loan_id;
    const installmentId = req.params.installmentId;

    // First, call the stored procedure `PayInstallment`
    const callProcedure = 'CALL PayInstallment(?, ?, @process);';
    const getProcess = 'SELECT @process AS answer;';

    // Run the CALL statement first
    db.query(callProcedure, [loan_id, installmentId], (err) => {
        if (err) {
            console.error('Error executing payment procedure:', err);
            return res.status(500).json({ error:'Insufficient funds for installment payment' });

        }

        // Then, retrieve the output parameter
        db.query(getProcess, (err, results) => {
            if (err) {
                console.error('Error fetching process result:', err);
                return res.status(500).json({ error: 'Database error occurred during processing' });
            }

            // Check the answer from the output parameter
            const result = results[0]?.answer;

            // Handle different scenarios based on result value
            if (result === 1) {
                res.status(200).json({ message: 'Payment successful' });
            } else if (result === 0) {
                res.status(400).json({ error: 'Insufficient funds for installment payment' });
            } else if (result === -1) {
                res.status(400).json({ error: 'Unable to maintain required minimum balance after payment' });
            } else {
                res.status(400).json({ error: 'Payment could not be processed due to an unknown error' });
            }
        });
    });
});

