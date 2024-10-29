import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; // Use this if needed
import './LoanInstallments.css';
import isTokenExpired from "./token_expire";

export default function LoanInstallments() {
  const [loans, setLoans] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch user's loans function
  const fetchLoans = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      setErrorMessage('User not logged in.');
      return;
    }

    let customerId;
    try {
      const decoded = jwtDecode(token); // Use if needed
      customerId = decoded.customer_id; // Use if needed
    } catch (error) {
      setErrorMessage('Invalid token.');
      return;
    }

    try {
      const customer_id = localStorage.getItem('customer_id');
      console.log("customer_id is ", customer_id);
      const token = localStorage.getItem("token"); // Retrieve token from localStorage
            if (isTokenExpired(token)) {
                alert("Session expired. Please log in again.");
                window.location.href = "/";
                return;
            }
      const response = await fetch(`http://localhost:3002/loans/due-installments/${customer_id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (response.ok) {
        setLoans(data);
      } else {
        setErrorMessage(data.error || 'Failed to fetch loans');
      }
    } catch (error) {
      console.error('Error fetching loans:', error);
      setErrorMessage('Failed to fetch loans');
    }
  };

  // Call fetchLoans on component mount
  useEffect(() => {
    fetchLoans();
  }, []);

  // Handle installment payment
  const handlePayment = async (loan_id, installmentId) => {
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`http://localhost:3002/pay-installment/${loan_id}/${installmentId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();

      if (response.ok) {
        setSuccessMessage(result.message);
        fetchLoans(); // Refresh loans after payment
      } else {
        setErrorMessage(result.error || 'Payment failed');
      }
    } catch (error) {
      console.error('Payment Error:', error);
      setErrorMessage('Something went wrong while processing the payment');
    }
  };

  return (
    <div className="loan-installment-container">
      <h1>Loan Installments</h1>

      {errorMessage && <div className="error-message">{errorMessage}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}

      <div className="loan-list">
        {loans.length > 0 ? (
          loans.map((loan) => (
            <div key={loan.installment_id} className="loan-item">
              <p>Loan ID: {loan.loan_id}</p>
              <p>Loan Description: {loan.description}</p>
              <p>Loan Amount: ${loan.amount}</p>
              <p>Due Date: {loan.due_date}</p>
              <p>No. of Installment: {loan.installment_id}</p>
              
              <button onClick={() => handlePayment(loan.loan_id, loan.installment_id)}>Pay Installment</button>
            </div>
          ))
        ) : (
          <p>No due loan installments.</p>
        )}
      </div>
    </div>
  );
};
