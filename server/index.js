const express=require('express');
const app=express();
const cors=require('cors');
const mysql=require('mysql2');
const bcrypt=require('bcrypt');

const generateUnique10DigitNumber=require('./generateCustomID');
const generateUnique8DigitNumber=require('./generateAccountID');
const calculateSavingPlan=require('./savingPlans');

app.use(cors());
app.use(express.json());

const db=mysql.createConnection({
    user:"root",
    host:"127.0.0.1",
    password:"Sandali6254560@",
    database:"bank",
});

// password hashing function
const createHashPassword= async(planPassword)=>{
    try{
        const saltRounds=10;
        const hashpassword=await bcrypt.hash(planPassword,saltRounds);
        return hashpassword;
    }catch(err){
        throw new Error("Error in hashing password",err.message);
    }
}

 //login request
app.post("/log",async(req,res)=>{
    const username=req.body.username;
    const passkey=req.body.passkey;

    db.query("SELECT * FROM customer join individual_customer on customer.customer_id=individual_customer.customer_id  join account on account.customer_id=customer.customer_id WHERE customer.customer_id=? AND hashed_password=?",
        [username,passkey],
        (err,result)=>{
            if(err){
                console.log(err);
            }else{
                if(result.length!=0){
                    res.send(result);
                }
                else{
                    db.query("SELECT * FROM customer join organization_customer on customer.customer_id=organization_customer.customer_id join account on account.customer_id=customer.customer_id WHERE customer.customer_id=? AND hashed_password=?",
                        [username,passkey],
                        (err,result)=>{
                            if(err){
                                console.log('balance getting error',err);
                            }else{
                                console.log(result[0].balance);
                                res.send(result);
                            }
                        }
                    )
                }
                
            }
        }
    )
});



// Cash withdraw request
app.post("/withdraw", (req, res) => {
    const amount = req.body.withdraw_amount;
    const Id = req.body.Acc_ID;
    const acc_type = req.body.Acc_type;

    const withdraw=`CALL withdraw_money(?,?,?,@status_w)`;
    db.execute(withdraw,[
        amount,Id,acc_type
    ],(err,result)=>{
        if(err){
            console.log("error in executing",err);
            return;
        }
        console.log(result);
        db.query("SELECT @status_w AS status",(err,result)=>{
            if(err){
                console.log("err fetching status");
                return;
            }
            const status=result[0].status;
            if(status===1){
                res.send({success:1});
            }else{
                res.send({success:0});
            }
        })
    })
});



app.post("/deposite", (req, res) => {
    const deposite_amount = req.body.deposite_amount;
    const ID = req.body.Acc_ID;
    const Acc_type = req.body.Acc_type;

    const deposit=`CALL deposit(?,?,@status_d)`;
    db.execute(deposit,[
        deposite_amount,ID
    ],(err,result)=>{
        if(err){
            console.log("error in deposit money",err);
        }
        console.log(result);
        db.query("SELECT @status_d AS status",(err,result)=>{
            if(err){
                console.log("error fetching status");
                return;
            }
            const status=result[0].status;
            if(status===1){
                res.send({success:1});
            }else{
                res.send({success:0});
            }
        })
    })
    
});


app.post("/transfer", (req, res) => {
    const from = req.body.from;
    const to = req.body.to;
    const amount = req.body.amount;
    const acc_type=req.body.Acc_type;

    const transfer=`CALL transaction_money(?,?,?,?,@status_p)`;
    db.execute(transfer,[
        amount,from,to,acc_type
    ],(err,result)=>{
        if(err){
            console.log("oops!!! transaction error",err);
            console.log(result);
            return;
            
        }
        console.log(result);
        db.execute("SELECT @status_p AS status",(err,result)=>{
            if(err){
                console.log("Error fetching status");
            }
            const status=result[0].status;
            if(status===1){
                res.send({success:1});
            }
        })
    })

});

app.get("/trans_detail", (req, res) => {
    const ID = req.query.Id;

    // Use Promise.all to handle both queries
    Promise.all([
        new Promise((resolve, reject) => {
            db.query("SELECT * FROM transaction_log WHERE account_id = ?", [ID], (err, result) => {
                if (err) {
                    reject(err); // Reject the promise if there's an error
                } else {
                    resolve(result); // Resolve with the result
                }
            });
        }),
        new Promise((resolve, reject) => {
            db.query("SELECT balance FROM account WHERE account_id = ?", [ID], (err, result) => {
                if (err) {
                    reject(err); // Reject the promise if there's an error
                } else {
                    resolve(result.length > 0 ? result[0].balance : null); // Resolve with the balance or null if not found
                }
            });
        })
    ])
    .then(([transactionDetails, balance]) => {
        res.send({ transactions: transactionDetails, balance: balance }); // Send a single response with both results
    })
    .catch(err => {
        console.error(err);
        res.status(500).send({ error: "An error occurred while fetching transaction details." }); // Send error response
    });
});


app.post("/employeelog",(req,res)=>{
    const employeeId=req.body.employeeId;
    const employeepasskey=req.body.employeepasskey;

    db.query("SELECT * FROM employees WHERE employee_id=? AND hashed_password=?",
        [employeeId,employeepasskey],
        (err,result)=>{
            if(err)
                console.log("error getting data",err);
            else{
                console.log("success");
                res.send(result);
            }
        }
    )
});

app.post("/createAcc",async (req,res)=>{
    const fname=req.body.fname;
    const lname=req.body.lname;
    const bDay=req.body.Bday;
    const nic=req.body.nic;
    const contactNo=req.body.contactNo;
    const email=req.body.email;
    const address=req.body.address;
    const password=req.body.password;
    const acc_type=req.body.Acctype;
    const Amount=req.body.Amount;
    const Date=req.body.Date;
    const customer_type=req.body.customer_type;
    const branch_id=req.body.branch_id;
    const reg_no=req.body.reg_no;
    const ContactPerson=req.body.contPerson;
    const position=req.body.position;

    const hashpassword= await createHashPassword(password);
    const customer_ID=generateUnique10DigitNumber();
    const acc_ID=generateUnique8DigitNumber();
    const plan_id=calculateSavingPlan(bDay);
    
    if(customer_type=="individual"){
        const addcustomer=`CALL create_account(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
        db.query(addcustomer,[
            customer_ID,customer_type,contactNo,hashpassword,email,address,
            fname,lname,bDay,nic,acc_ID,branch_id,acc_type,Amount,Date,"","","","",plan_id
        ],(err,result)=>{
            if(err){
                console.error("error calling procedure.",err);
                res.send({success:0});
                return
            }
            console.log('Procedure result:', result);
            res.send({success:1});
        })
    }
    else{
        const addcustomer=`CALL create_account(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
        db.query(addcustomer,[
            customer_ID,customer_type,contactNo,hashpassword,email,address,"","",null,"",
            acc_ID,branch_id,acc_type,Amount,Date,fname,reg_no,ContactPerson,position,plan_id
        ],(err,result)=>{
            if(err){
                console.error("error calling procedure.",err);
                return
            }
            console.log('Procedure result:', result);
            res.send({success:1});
        })
    }
    
    
});

app.post("/insertEmployee",async(req,res)=>{
    const em_id=req.body.em_id;
    const name=req.body.name;
    const role=req.body.role;
    const branch_id=req.body.branch_id;
    const password=req.body.password;
    const email=req.body.email;
    const address=req.body.address;
    const number=req.body.contactNo;

    const hashPasskey=await createHashPassword(password);

    const insertEmployee=`CALL insert_employee(?,?,?,?,?,?,?,?)`;
    db.query(insertEmployee,[
        em_id,name,role,branch_id,hashPasskey,email,address,number
    ],(err,result)=>{
        if(err){
            console.error("error calling procedure.",err);
            res.send({success:0});
            return
        }
        console.log('Procedure result:', result);
        res.send({success:1});
    })
});

app.post("/fixdepo",(req,res)=>{
    console.log("fixed");
    const acc_id=req.body.acc_id;
    const plan=req.body.plan;
    const date=req.body.date;
    const amount=req.body.amount;
    const acc_type=req.body.acc_type;

    console.log(acc_id,plan,date,amount,acc_type);

    const start_FD=`CALL insert_into_fixed_deposit(?,?,?,?,?,@status_f)`;
    db.query(start_FD,[
        amount,acc_id,acc_type,plan,date
    ],(err,result)=>{
        if(err){
            console.log("FD create error",err);
            res.send({success:2});
            return
        }
        console.log(result);
        db.execute("SELECT @status_f AS status",(err,result)=>{
            if(err){
                console.log("Error fetching status");
            }
            const status=result[0].status;
            console.log(status);
            if(status===1){
                res.send({success:1});
            }
            else{
                res.send({success:0});
            }
        })
    });
    
    
});

app.post("/trans_report",(req,res)=>{
    const branch_id=req.body.branch_id;

    const trans_report=`CALL transaction_report(?)`;
    db.execute(trans_report,[
        branch_id
    ],(err,result)=>{
        if(err){
            console.log("procudure call error.");
            return;
        }
        console.log(result);
        res.send(result);
    })
})



app.listen(3002,()=>{
    console.log("server connect with port 3002.");
});

