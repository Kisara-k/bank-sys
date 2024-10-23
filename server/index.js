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
                    res.send({success:1});
                }

            })
        }
    )
})

