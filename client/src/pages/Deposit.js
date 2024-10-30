import React, { useState,useEffect } from 'react';
import Axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import './Deposit.css'; // Adjust path as necessary



const Deposit = () => {
    const [depositAmount, setDepositAmount] = useState('');
    const [message, setMessage] = useState({ text: '', type: '' });
    const [acc_id, setID] = useState("");
    const [passkey, setkey] = useState("");
    const [real_id,setReal]=useState("");

    const isTokenExpired = (token) => {
        if (!token) return true;
        const decodedToken = jwtDecode(token);
        return decodedToken.exp < Date.now() / 1000;
    };

    useEffect(()=>{
        const getData = localStorage.getItem("logdetails");

        if (getData) {
            const pasedData = JSON.parse(getData);
            setReal(pasedData[0].account_id);
        }
    })

    const handleDeposit = () => {
        const token = localStorage.getItem("token");

        if (isTokenExpired(token)) {
            alert("Session expired. Please log in again.");
            window.location.href = "/";
            return;
        }

        if (!depositAmount || isNaN(depositAmount) || depositAmount <= 0) {
            setMessage({ text: "Please enter a valid deposit amount.", type: "error" });
            return;
        }
        if(acc_id!=real_id){
            setMessage({ text: "Account number mismatch.", type: "error" });
            return;
        }

        Axios.post("http://localhost:3002/account/deposite", { amount: depositAmount, acc_id: acc_id, passkey: passkey }, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(() => {
            setMessage({ text: "Deposit successful!", type: "success" });
            setDepositAmount('');
            setID('');
            setkey('');
        })
        .catch(() => {
            setMessage({ text: "Deposit failed. Please try again.", type: "error" });
        });
    };

    const back_dash=()=>{
        window.location.href="/account";
    }

    return (
        <><div className="deposit-container">
            <div className="deposit-card">
                <h2>Deposit</h2>

                <label className="input-label">Account Number</label>
                <input
                    type="text"
                    onChange={(event) => { setID(event.target.value); } }
                    placeholder="Account Number"
                    className="input-field" />

                <label className="input-label">Amount</label>
                <input
                    type="text"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    placeholder="Enter deposit amount"
                    className="input-field" />

                <button onClick={handleDeposit} className="deposit-button">Submit</button>

                {message.text && (
                    <p className={message.type === "success" ? "success-message" : "error-message"}>
                        {message.text}
                    </p>
                )}
            </div>
        </div>
        <div id="back_dash">
        <input type='button' className='btn btn-primary' onClick={back_dash} id="dash_btn" value="Back to dashboard" ></input>
        </div></>
    );
};

export default Deposit;