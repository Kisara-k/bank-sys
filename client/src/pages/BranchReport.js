import React, { useState, useEffect } from "react";
import Axios from "axios"; // Import Axios if you're going to make API calls
import './BranchReport.css';
import isTokenExpired from "./token_expire";

export default function BranchReport() {
    const [transaction_report, setReport] = useState([]);

    useEffect(() => {
        const fetchTransactionReport = async () => {
            const token = localStorage.getItem("token"); // Retrieve token from localStorage
            if (isTokenExpired(token)) {
                alert("Session expired. Please log in again.");
                window.location.href = "/";
                return;
            }
            try {
                const response = await Axios.get("http://localhost:3002/report/branch", {
                    headers: {
                        Authorization: `Bearer ${token}` // Add token to headers
                    }
                });
                
                if (response.data) {
                    setReport(response.data); // Assuming your API returns the report in the response data
                }
            } catch (error) {
                console.error("Error fetching branch report:", error);
            }
        };

        fetchTransactionReport();
    }, []); // Run once when the component mounts

    return (
        <div id="trans_report">
            <h1 id="report_topic">Branch Wise Transaction Report</h1>
            <table id="trans_table">
                <thead>
                    <tr>
                        <th>Transaction ID</th>
                        <th>Sender Acc No</th>
                        <th>Amount</th>
                        <th>Sender Acc Type</th>
                        <th>Receiver Acc No</th>
                        <th>Transaction Date</th>
                    </tr>
                </thead>
                <tbody>
                    {transaction_report.length > 0 ? (
                        transaction_report.map((val, key) => {
                            let textColor;
                            if (val.type === 'withdrawal') {
                                textColor = 'red';
                            } else if (val.type === 'transfer') {
                                textColor = 'rgba(233, 161, 17, 0.765)';
                            } else if (val.type === 'deposit') {
                                textColor = 'rgb(29, 200, 29)';
                            }
                            return (
                                <tr key={key}>
                                    <td>{val.transaction_id}</td>
                                    <td>{val.account_id}</td>
                                    <td>{val.amount}</td>
                                    <td style={{ color: textColor, fontWeight: "600" }}>{val.type}</td>
                                    <td>{val.receive_transaction_id}</td>
                                    <td>{val.date}</td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan="6">No transactions available.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
