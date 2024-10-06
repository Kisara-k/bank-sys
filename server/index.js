const express=require('express');
const app=express();
const cors=require('cors');
const mysql=require('mysql2');

app.use(cors());
app.use(express.json());

const db=mysql.createConnection({
    user:"root",
    host:"localhost",
    password:"20020927",
    database:"project",
});

 //login request
app.post("/log",(req,res)=>{
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
                                console.log(err);
                            }else{
                                res.send(result);
                            }
                        }
                    )
                }
                
            }
        }
    )
});

  //create trigger to update account table when change the saving account table
/* const withdrawFromSaving=`
    CREATE TRIGGER account_update_after_withdraw_saving
    AFTER UPDATE ON \`saving account\`
    FOR EACH ROW
    BEGIN
        UPDATE account SET Balance=NEW.Amount WHERE account.Account_ID=NEW.Account_ID;
    END;
`;  

db.query(withdrawFromSaving,(err)=>{
    if(err)
        console.log(err);
    else
        console.log("Trigger created");
});

const withdrawFromchecking=`
    CREATE TRIGGER account_update_after_withraw_checking
    AFTER UPDATE ON checking_account
    FOR EACH ROW
    BEGIN
        UPDATE account SET Balance=NEW.Amount WHERE account.Account_ID=NEW.Account_ID;
    END;
`; */

// when the withdraw or deposite happen, update saving and checking accounts
const update_saving_checking=`
CREATE TRIGGER update_account_after_saving_or_checking_update
AFTER UPDATE ON account
FOR EACH ROW
BEGIN
    IF EXISTS (SELECT 1 FROM saving_account WHERE saving_account.account_id = NEW.account_id) THEN
        UPDATE saving_account SET balance = NEW.balance WHERE account_id = NEW.account_id;
    ELSEIF EXISTS (SELECT 1 FROM checking_account WHERE checking_account.account_id = NEW.account_id) THEN
        UPDATE checking_account SET balance = NEW.balance WHERE account_id = NEW.account_id;
    END IF;
END;
`;


db.query(update_saving_checking,(err)=>{
    if(err)
        console.log(err);
    else
        console.log("Trigger success!");
});

function Withdraw(amount, Id, callback) {
    const withdrawMoney = "UPDATE account SET balance = balance - ? WHERE account_id = ?";
    db.execute(withdrawMoney, [amount, Id], (err, result) => {
        if (err) {
            return callback(err);
        }

        const insertLog = `
            INSERT INTO transaction_log (account_id, date, amount, type) 
            VALUES (?, NOW(), ?, 'withdrawal')`;
        db.execute(insertLog, [Id, amount], (err, result) => {
            if (err) {
                return callback(err);
            }

            console.log("savingWithdraw executed");
            callback(null);
        });
    });
}

// Cash withdraw request
app.post("/withdraw", (req, res) => {
    const amount = req.body.withdraw_amount;
    const Id = req.body.Acc_ID;
    const acc_type = req.body.Acc_type;

    db.beginTransaction((err) => {
        if (err) {
            console.log("Transaction start error");
            return res.status(500).send({ success: 0, message: "Transaction start error" });
        }

        db.query("SELECT balance FROM account WHERE account_id = ?", [Id], (err, result) => {
            if (err) {
                return db.rollback(() => {
                    console.log("Error of getting balance");
                    res.status(500).send({ success: 0, message: "Error of getting balance" });
                });
            }

            const current = Number(result[0].balance);
            console.log(current);

            db.query("SELECT min_balance FROM saving_account_plans JOIN saving_account ON saving_account_plans.plan_id = saving_account.plan_id WHERE saving_account.account_id = ?", [Id],
                (err, result) => {
                    if (err) {
                        return db.rollback(() => {
                            console.log("Error retrieving minimum balance");
                            res.status(500).send({ success: 0, message: "Error retrieving minimum balance" });
                        });
                    }

                    const min_balance = acc_type === "savings" ? Number(result[0].min_balance) : 0;
                    console.log(min_balance);

                    if ((acc_type === "savings" && min_balance <= current - amount) || (acc_type === "checking" && current >= amount)) {
                        Withdraw(amount, Id, (err) => {
                            if (err) {
                                return db.rollback(() => {
                                    console.log("Error of withdrawing money");
                                    res.status(500).send({ success: 0, message: "Error of withdrawing money" });
                                });
                            }

                            db.commit((err) => {
                                if (err) {
                                    return db.rollback(() => {
                                        console.log("Error committing transaction");
                                        res.status(500).send({ success: 0, message: "Error committing transaction" });
                                    });
                                }
                                
                                console.log("Withdraw success!");
                                db.query("SELECT balance FROM account WHERE account_id = ?", [Id], (err, result) => {
                                    if (err) {
                                        console.log("Getting balance after withdraw error");
                                        return res.status(500).send({ success: 0, message: "Error getting balance after withdraw" });
                                    }

                                    res.send({ Balance: result[0].balance, success: 1 });
                                });
                            });
                        });
                    } else {
                        return db.rollback(() => {
                            console.log("Insufficient balance or minimum balance not met");
                            res.send({ success: 2, message: "Insufficient balance or minimum balance not met" });
                        });
                    }
                });
        });
    });
});



app.post("/deposite", (req, res) => {
    const deposite_amount = req.body.deposite_amount;
    const ID = req.body.Acc_ID;
    const Acc_type = req.body.Acc_type;

    db.beginTransaction((err)=>{
        if(err){
            console.log("Transaction start error!");
        }

        const depositeMoney="UPDATE account SET balance=balance+? WHERE account_id=?";
        db.execute(depositeMoney,[deposite_amount,ID],(err,result)=>{
            if(err){
                return db.rollback(()=>{
                    console.log("Error updating balance");
                })
            }

            const enterLog=`
                INSERT INTO transaction_log (account_id, date, amount, type) 
                VALUES (?, NOW(), ?, 'deposite')`;
            db.execute(enterLog,[ID,deposite_amount],(err,result)=>{
                if(err){
                    return db.rollback(()=>{
                        console.log("log insert error!",err);
                    })
                }

                db.commit();
                console.log("deposite success");
                db.query("SELECT balance FROM account WHERE account_id=?",[ID],
                    (err,result)=>{
                        if(err){
                            console.log(err);
                        }else{
                            res.send({Balance:result[0].balance,success:1});
                        }
                    }
                )
            })
        })
    })
    
});

function Transfer(amount,from,to,callback){

    const send="UPDATE account SET balance=balance-? WHERE account_id=?";
    db.execute(send,[amount,from],(err,result)=>{
        if(err){
            return callback(err);
        }

        const receive="UPDATE account SET balance=balance+? WHERE account_id=?";
        db.execute(receive,[amount,to],(err,result)=>{
            if(err){
                return callback(err);
            }

            const enterLog=`
                        INSERT INTO transaction_log (account_id, date, amount, type) 
                        VALUES (?, NOW(), ?, 'transfer')`;
            db.execute(enterLog,[from,amount],(err,result)=>{
                if(err){
                    return callback(err);
                }

                console.log("Tranfer executed");
                callback(null);
            })
        })
    })
}


app.post("/transfer", (req, res) => {
    const from = req.body.from;
    const to = req.body.to;
    const amount = req.body.amount;
    const acc_type=req.body.Acc_type;

    db.beginTransaction((err) => {
        if (err) {
            console.log("Transaction start error");
            return res.status(500).send({ success: 0, message: "Transaction start error" });
        }

        db.query("SELECT balance FROM account WHERE account_id = ?", [from], (err, result) => {
            if (err) {
                return db.rollback(() => {
                    console.log("Error of getting balance");
                    res.status(500).send({ success: 0, message: "Error of getting balance" });
                });
            }

            const current = Number(result[0].balance);
            console.log(current);

            db.query("SELECT min_balance FROM saving_account_plans JOIN saving_account ON saving_account_plans.plan_id = saving_account.plan_id WHERE saving_account.account_id = ?", [from],
                (err, result) => {
                    if (err) {
                        return db.rollback(() => {
                            console.log("Error retrieving minimum balance");
                            res.status(500).send({ success: 0, message: "Error retrieving minimum balance" });
                        });
                    }

                    const min_balance = acc_type === "savings" ? Number(result[0].min_balance) : 0;
                    console.log(min_balance);

                    if ((acc_type === "savings" && min_balance <= current - amount) || (acc_type === "checking" && current >= amount)) {
                        Transfer(amount,from, to,(err) => {
                            if (err) {
                                return db.rollback(() => {
                                    console.log("Error of withdrawing money");
                                    res.status(500).send({ success: 0, message: "Error of withdrawing money" });
                                });
                            }

                            db.commit((err) => {
                                if (err) {
                                    return db.rollback(() => {
                                        console.log("Error committing transaction");
                                        res.status(500).send({ success: 0, message: "Error committing transaction" });
                                    });
                                }
                                
                                console.log("Withdraw success!");
                                db.query("SELECT balance FROM account WHERE account_id = ?", [from], (err, result) => {
                                    if (err) {
                                        console.log("Getting balance after withdraw error");
                                        return res.status(500).send({ success: 0, message: "Error getting balance after withdraw" });
                                    }

                                    res.send({ Balance: result[0].balance, success: 1 });
                                });
                            });
                        });
                    } else {
                        return db.rollback(() => {
                            console.log("Insufficient balance or minimum balance not met");
                            res.send({ success: 2, message: "Insufficient balance or minimum balance not met" });
                        });
                    }
                });
        });
    });


});

app.get("/trans_detail",(req,res)=>{
    const ID=req.query.Id;
    db.query("select * from transaction_log where account_id=?",
        [ID],
        (err,result)=>{
            if(err)
                console.log(err);
            else
                res.send(result);
        }
    )
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
})




app.listen(3002,()=>{
    console.log("server connect with port 3002.");
});

