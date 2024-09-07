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
    database:"bank",
});

app.post("/log",(req,res)=>{
    const username=req.body.username;
    const passkey=req.body.passkey;

    db.query("SELECT * FROM customer join individual_customer on customer.Customer_ID=individual_customer.Customer_ID  join account on account.Customer_ID=customer.Customer_ID WHERE customer.Customer_ID=? AND Pass_Word=?",
        [username,passkey],
        (err,result)=>{
            if(err){
                console.log(err);
            }else{
                if(result.length!=0){
                    res.send(result);
                }
                else{
                    db.query("SELECT * FROM customer join organization_customer on customer.Customer_ID=organization_customer.Customer_ID join account on account.Customer_ID=customer.Customer_ID WHERE customer.Customer_ID=? AND Pass_Word=?",
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
})

app.listen(3002,()=>{
    console.log("server connect with port 3002.");
});

