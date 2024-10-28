import React, { useState } from 'react';
import Axios from 'axios';
import {jwtDecode} from 'jwt-decode'; // Correct import
import './Withdraw.css'; // Import the CSS file for styling

const Withdraw = () => {
    const [withdrawAmount, setWithdrawAmount] = useState(0);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const isTokenExpired = (token) => {
        if (!token) return true;
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        return decodedToken.exp < currentTime;
    };

    const handleWithdraw = () => {
        const token = localStorage.getItem("token");

        if (isTokenExpired(token)) {
            alert("Session expired. Please log in again.");
            window.location.href = "/";
            return;
        }

        if (withdrawAmount === 0) {
            setErrorMessage("Withdrawal amount cannot be zero.");
            return;
        }

        Axios.post("http://localhost:3002/account/withdraw", { amount: withdrawAmount }, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => {
            setSuccessMessage("Withdrawal successful!");
            setErrorMessage('');
        })
        .catch(error => {
            setErrorMessage("Withdrawal failed. Please try again.");
            setSuccessMessage('');
        });
    };

    return (
        <div className="withdraw-container">
            <h1>Withdraw</h1>
            <input
                type="number"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                placeholder="Enter withdrawal amount"
            />
            <button onClick={handleWithdraw}>Withdraw</button>
            {successMessage && <p className="success-message">{successMessage}</p>}
            {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>
    );
};

export default Withdraw;