import React, { useState, useEffect } from 'react';
import './loanstatus.css'; // Your styling file for the layout

const LoanStatus = () => {
  const [loans, setLoans] = useState([]);

  // Fetch loan details from an API (mocked here)
  useEffect(() => {
    // Replace this with your actual API call
    fetch('/api/loans') 
      .then(response => response.json())
      .then(data => setLoans(data))
      .catch(error => console.error('Error fetching loan data:', error));
  }, []);

  return (
    <div className="loan-status-container">
      <h1>Loan Status</h1>
      {loans.map(loan => (
        <div key={loan.loan_id} className="loan-status-card">
          <h3>Loan Number: {loan.loan_id}</h3>
          <p><strong>Account Number:</strong> {loan.account_id}</p>
          <p><strong>Amount:</strong> {loan.amount}</p>
          <p><strong>Branch:</strong> {loan.branch_id}</p>
          <p><strong>Apply Date:</strong> {loan.start_date}</p>
          <p><strong>Status:</strong> {loan.status}</p>
        </div>
      ))}
    </div>
  );
};

export default LoanStatus;
