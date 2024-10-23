import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './loanstatus.css'; // Import the CSS file

const LoanTable = () => {
    const [loans, setLoans] = useState([]);

    // Fetch loan data from the backend
    useEffect(() => {
        const fetchLoans = async () => {
            try {
                const response = await axios.get('/api/loans'); // Assuming backend API is running locally
                setLoans(response.data);
            } catch (error) {
                console.error('Error fetching loan data', error);
            }
        };

        fetchLoans();
    }, []);

    return (
        <div className="table-container">
            <h2>Loan Details</h2>
            {loans.length === 0 ? (
                <p>You haven't any loan.</p>
            ) : (
                <table border="1" cellPadding="10">
                    <thead>
                        <tr>
                            <th>Loan ID</th>
                            <th>Amount</th>
                            <th>Account ID</th>
                            <th>Rate</th>
                            <th>Monthly Installment</th>
                            <th>Duration (Months)</th>
                            <th>Start Date</th>
                            <th>Type</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loans.map((loan) => (
                            <tr key={loan.id}>
                                <td>{loan.id}</td>
                                <td>{loan.amount}</td>
                                <td>{loan.accountId}</td>
                                <td>{loan.rate}</td>
                                <td>{loan.monthlyInstallment}</td>
                                <td>{loan.duration}</td>
                                <td>{loan.startDate}</td>
                                <td>{loan.type}</td>
                                <td>{loan.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default LoanTable;