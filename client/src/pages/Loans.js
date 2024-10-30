import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import './Loans.css';

export default function Loans() {
    const email = "user@example.com"; // Assume this is set when the user logs in
    const [accountNo, setAccountNo] = useState('');
    const [loanType, setLoanType] = useState('Personal loan');
    const [duration, setDuration] = useState('6'); // Default to 6 months
    const [loanAmount, setLoanAmount] = useState('');
    const [loanReason, setLoanReason] = useState(''); // New state for loan reason
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const MAX_LOAN_AMOUNT = 500000; // Maximum loan amount
    const navigate = useNavigate(); // Initialize useNavigate hook

    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevent the default form submission

        // Reset messages
        setErrorMessage('');
        setSuccessMessage('');

        // Validation checks
        if (!accountNo || !loanAmount || !duration || !loanReason) {
            setErrorMessage('Please fill in all required fields.');
            return;
        }

        const accountNoRegex = /^[0-9]{1,10}$/; // Validate account number format
        if (!accountNoRegex.test(accountNo)) {
            setErrorMessage('Please enter a valid account number (1-10 digits).');
            return;
        }

        if (isNaN(loanAmount) || loanAmount <= 0) {
            setErrorMessage('Please enter a valid loan amount.');
            return;
        }

        if (loanAmount > MAX_LOAN_AMOUNT) {
            setErrorMessage('Loan amount cannot exceed ' + MAX_LOAN_AMOUNT + '.');
            return;
        }

        if (![6, 12, 24].includes(parseInt(duration))) {
            setErrorMessage('Please enter a valid duration (6, 12, or 24 months).');
            return;
        }

        // Call backend API to submit the loan application
        const response = await fetch('http://localhost:3002/apply-loan', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}` // Add token to Authorization header
            },
            body: JSON.stringify({  
                accountNo, 
                loanAmount, 
                duration: parseInt(duration), // Use the integer value for duration
                loanReason // Include loan reason in the request body
            }), 
        });
        
        
        const data = await response.json();

        if (response.ok) {
            setSuccessMessage(data.message); // Set success message from the backend
        } else {
            setErrorMessage(data.message || 'Something went wrong. Please try again.');
        }
    };

    const handleInstallmentClick = () => {
        navigate('/loan-installments'); // Navigate to the loan installments page
    };

    return (
        <>
            <nav id="nav2">
                <Link className="link2" to="/account">Home</Link>
                <Link className="link2" to="/loans">Loans</Link>
            </nav>

            <div id="top">
                <span id="x1">Are you</span><br />
                <span id="x2">looking for</span><br />
            </div>

            <div className="row" id="icons">
                <div className="col-sm-4" id="personal">
                    <img src="personal.png" id="personalImg" alt="Personal Loan" />
                    <br />
                    <span id="d1">Personal/Business Loans</span>
                </div>
                <div className="col-sm-4" id="deposite">
                    <img src="deposit.png" id="personalImg" alt="Fixed Deposit" />
                    <br />
                    <span id="d1">Need a fixed deposit</span>
                </div>
                <div className="col-sm-4" id="loan">
                    <img src="capital.png" id="personalImg" alt="Loan" />
                    <br />
                    <span id="d1">Loan up to 60% of FD</span>
                </div>
            </div>

            <div id="loanDetail">
                <p>Our loan management system allows employees to log in securely and create loan requests using a standard application form. Once submitted, the loan requires branch manager approval before it is confirmed. For customers, we offer a special online loan system, where loans can be applied for instantly without manager approval. Customers with an existing Fixed Deposit (FD) can apply for a loan up to 60% of their FD’s value, with a maximum limit of 500,000. Upon approval, the loan amount is directly deposited into the savings account linked to the FD.</p>
            </div>

            <div className="row" id="oprionBtns">
                <div className="row" id="installments2">
                    <div className="col-sm-4">
                        <Link to="/loan-status">
                            <input type="button" id="statustBtn" className="btn-btn-primary" value="loan status" />
                        </Link>
                    </div>
                    <div className="col-sm-4">
                        <input type="button" id="installmentBtn" className="btn-btn-primary" value="Pay Loan Installments" onClick={handleInstallmentClick} />
                    </div>
                </div>
                
            </div>

            <div id="loanform">
                <h1 id="loanhead"><center> Loan Application </center></h1>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="acc">Enter fixed deposit account no:</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            id="accNo" 
                            value={accountNo} 
                            onChange={(e) => setAccountNo(e.target.value)} 
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="loan-type">Select loan type:</label>
                        <select 
                            className="form-control" 
                            id="ltype" 
                            value={loanType} 
                            onChange={(e) => setLoanType(e.target.value)}>
                            <option>Personal loan</option>
                            <option>Business loan</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="duration">Enter duration:</label>
                        <select 
                            className="form-control" 
                            id="duration" 
                            value={duration} 
                            onChange={(e) => setDuration(e.target.value)}>
                            <option value="6">6 months - 10% rate</option>
                            <option value="12">12 months - 7% rate</option>
                            <option value="24">24 months - 5% rate</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="amount">Loan amount:</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            id="lamount" 
                            value={loanAmount} 
                            onChange={(e) => setLoanAmount(e.target.value)} 
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="reason">Reason for loan:</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            id="reason" 
                            value={loanReason} 
                            onChange={(e) => setLoanReason(e.target.value)} 
                        />
                    </div>

                    <div className="form-group">
                        <input className="form-control" id="reqBtn" type="submit" value="Apply for Loan" />
                    </div>
                </form>
                {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                {successMessage && <div className="alert alert-success">{successMessage}</div>}
            </div>
        </>
    );
}