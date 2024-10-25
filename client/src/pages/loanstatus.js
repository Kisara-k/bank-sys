import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './loanstatus.css'; // Import the CSS file

const LoanTable = ({ customerId }) => {
    const [loans, setLoans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLoans = async () => {
            try {
                // Fetch account number using customer ID
                const accountResponse = await axios.get(`http://localhost:3002/api/accounts?customerId=${customerId}`);
                if (accountResponse.status !== 200) {
                    throw new Error('Account not found');
                }
                const accountId = accountResponse.data.accountId;

                // Fetch loan details using account number
                const loanResponse = await axios.get(`http://localhost:3002/api/loans?accountId=${accountId}`);
                if (loanResponse.status !== 200) {
                    throw new Error('Loans not found');
                }
                setLoans(loanResponse.data);
            } catch (error) {
                console.error('Error fetching loan data', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchLoans();
    }, [customerId]);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div id="loan-status-page">
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
        </div>
    );
};

export default LoanTable;