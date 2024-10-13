import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import './Loans.css';

export default function Loans() {
    const [accountNo, setAccountNo] = useState('');
    const [loanType, setLoanType] = useState('Personal loan');
    const [duration, setDuration] = useState('6 months');
    const [loanAmount, setLoanAmount] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [hasFD, setHasFD] = useState(true); // New state to track if the customer has FD
    const [checkingFDMessage, setCheckingFDMessage] = useState('');

    const MAX_LOAN_AMOUNT = 500000; // Maximum loan amount
    const FD_VALUE = 1000000; // Example fixed deposit value
    const MAX_LOAN_LIMIT = FD_VALUE * 0.6; // 60% of FD value

    // Check if customer has FD when account number changes
    useEffect(() => {
        const checkFD = async () => {
            if (accountNo) {
                setCheckingFDMessage('Checking for fixed deposit...'); // Optional: Inform the user
                try {
                    const response = await fetch(`/api/check-fd?accountNo=${accountNo}`);
                    const data = await response.json();
                    if (data.hasFD) {
                        setHasFD(true);
                        setCheckingFDMessage('');
                    } else {
                        setHasFD(false);
                        setCheckingFDMessage('No fixed deposit account found for this customer.');
                    }
                } catch (error) {
                    setHasFD(false);
                    setCheckingFDMessage('Error checking fixed deposit status.');
                }
            } else {
                setCheckingFDMessage('');
            }
        };

        checkFD();
    }, [accountNo]); // Trigger this effect when accountNo changes

    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevent the default form submission

        // Reset messages
        setErrorMessage('');
        setSuccessMessage('');

        // Example validation checks
        if (!accountNo || !loanAmount || !password) {
            setErrorMessage('Please fill in all required fields.');
            return;
        }

        // Validate account number format
        const accountNoRegex = /^[0-9]{1,10}$/; // Example regex for account number (1 to 10 digits)
        if (!accountNoRegex.test(accountNo)) {
            setErrorMessage('Please enter a valid account number (1-10 digits).');
            return;
        }

        if (isNaN(loanAmount) || loanAmount <= 0) {
            setErrorMessage('Please enter a valid loan amount.');
            return;
        }

        if (loanAmount > MAX_LOAN_LIMIT) {
            setErrorMessage(`Loan amount cannot exceed ${MAX_LOAN_LIMIT}.`);
            return;
        }

        if (loanAmount > MAX_LOAN_AMOUNT) {
            setErrorMessage(`Loan amount cannot exceed ${MAX_LOAN_AMOUNT}.`);
            return;
        }

        // Prevent submission if the user does not have a fixed deposit
        if (!hasFD) {
            setErrorMessage('You must have a fixed deposit to apply for a loan.');
            return;
        }

        // Call your backend API to validate and submit the loan application
        const response = await fetch('/api/apply-loan', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ accountNo, loanType, duration, loanAmount, password }), // Include password in the request
        });

        const data = await response.json();

        if (response.ok) {
            // If successful
            setSuccessMessage('Loan application submitted successfully!');
        } else {
            // If there's an error
            setErrorMessage(data.message || 'Something went wrong. Please try again.');
        }
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

            <div id="loanform">
                <h1 id="loanhead"> Loan Application___</h1>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="acc">Enter account no:</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            id="accNo" 
                            value={accountNo} 
                            onChange={(e) => setAccountNo(e.target.value)} 
                        />
                        {checkingFDMessage && <small className="text-danger">{checkingFDMessage}</small>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Enter Password:</label>
                        <input 
                            type="password" 
                            className="form-control" 
                            id="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
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
                        <label htmlFor="duration">Select duration:</label>
                        <select 
                            className="form-control" 
                            id="duration" 
                            value={duration} 
                            onChange={(e) => setDuration(e.target.value)}>
                            <option>6 months</option>
                            <option>12 months</option>
                            <option>24 months</option>
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
                        <input className="form-control" id="reqBtn" type="submit" value="Apply for Loan" />
                    </div>
                </form>
                {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                {successMessage && <div className="alert alert-success">{successMessage}</div>}
            </div>
        </>
    );
}
