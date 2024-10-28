import React, { useState } from 'react';
import Axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import './Deposit.css'; // Adjust path as necessary

const Deposit = () => {
    const [depositAmount, setDepositAmount] = useState('');
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

    const isTokenExpired = (token) => {
        if (!token) return true;
        const decodedToken = jwtDecode(token);
        return decodedToken.exp < Date.now() / 1000;
    };

    const handleSendOtp = () => {
        const token = localStorage.getItem("token");

        if (isTokenExpired(token)) {
            alert("Session expired. Please log in again.");
            window.location.href = "/";
            return;
        }

        Axios.post("http://localhost:3002/send-otp", {}, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => {
            setOtpSent(true);
            setMessage({ text: "OTP sent to your registered phone number.", type: "success" });
        })
        .catch(() => {
            setMessage({ text: "Failed to send OTP. Please try again.", type: "error" });
        });
    };

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

        if (!otp) {
            setMessage({ text: "Please enter the OTP.", type: "error" });
            return;
        }

        Axios.post("http://localhost:3002/account/deposit", { amount: depositAmount, otp }, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(() => {
            setMessage({ text: "Deposit successful!", type: "success" });
            setDepositAmount('');
            setOtp('');
            setOtpSent(false);
        })
        .catch(() => {
            setMessage({ text: "Deposit failed. Please try again.", type: "error" });
        });
    };

    return (
        <div className="deposit-container">
            <div className="deposit-card">
                <h2>Deposit</h2>
                
                <label className="input-label">Account Number</label>
                <input
                    type="text"
                    placeholder="Account Number"
                    className="input-field"
                />
                <div style={{ marginBottom: '1rem' }}></div> {/* Added gap */}
                <label className="input-label">Password</label>
                <input
                    type="password"
                    placeholder="Password"
                    className="input-field"
                />
                
                <div style={{ marginBottom: '1rem' }}></div> {/* Added gap */}

                <label className="input-label">Deposit Amount</label>
                <input
                    type="text"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    placeholder="Amount"
                    className="input-field"
                />
                
                <button onClick={handleSendOtp} className="otp-button">Get OTP Code</button>
                
               
                <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter OTP"
                    className="input-field"
                    disabled={!otpSent}
                />
                
                <button onClick={handleDeposit} className="deposit-button">Submit</button>
                {message.text && (
                    <p className={message.type === "success" ? "success-message" : "error-message"}>
                        {message.text}
                    </p>
                )}
            </div>
        </div>
    );
};

export default Deposit;
