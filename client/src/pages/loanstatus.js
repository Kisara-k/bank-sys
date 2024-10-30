import React, { useState, useEffect } from 'react';
import  Axios  from 'axios';
import './loanstatus.css'; // Import the CSS file

const LoanTable = () => {
    const [loans, setLoans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [accountId,setId]=useState("");

    useEffect(() => {

        const getData=localStorage.getItem("logdetails");
        if(getData){
            const customerDetail=JSON.parse(getData);
            setId(customerDetail[0].account_id);
            console.log(accountId);
        };
        Axios.post("http://localhost:3002/loans",{
            accountId:accountId
        }).then((response)=>{
            setLoans(response.data);
        })

    });

    

    return (
        <div id="loan-status-page">
            <div className="table-container">
                <h2>Loan Details</h2>
                {loans.length === 0 ? (
                    <p id="noLoan">You haven't any loan.</p>
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
                                    <td>{loan.loan_id}</td>
                                    <td>{loan.amount}</td>
                                    <td>{loan.account_id}</td>
                                    <td>{loan.rate}</td>
                                    <td>{loan.monthly_installment}</td>
                                    <td>{loan.duration_months}</td>
                                    <td>{new Date(loan.start_date).toLocaleDateString()}</td>
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