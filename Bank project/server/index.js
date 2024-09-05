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

    db.query("SELECT * FROM customer WHERE customer_ID=? AND passkey=?",
        [username,passkey],
        (err,result)=>{
            if(err){
                console.log(err);
            }else{
                res.send(result);
            }
        }
    )
})

app.listen(3002,()=>{
    console.log("server connect with port 3002.");
});

