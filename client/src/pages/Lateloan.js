import React, { useState, useEffect } from "react";
import Axios from "axios";
import isTokenExpired from "./token_expire"; // Assuming token_expire.js has the token expiration function
import './BranchReport.css';

export default function BranchReport() {
    const [transaction_report, setReport] = useState([]);

    useEffect(() => {
        const report = localStorage.getItem("branch_transaction");
        const token = localStorage.getItem("token");

        if (report) {
            const branch_report = JSON.parse(report);
            setReport(branch_report);
        } else if (token) { 
            if (isTokenExpired(token)) {
                alert("Session expired. Please log in again.");
                window.location.href = "/";
                return;
            }

            // Fetch branch transaction report from the server with authorization
            Axios.get("http://localhost:3002/branch_report", {
                headers: {
                    Authorization: Bearer ${token}
                }
            }).then((response) => {
                setReport(response.data);
                localStorage.setItem("branch_transaction", JSON.stringify(response.data));
            }).catch((error) => {
                console.error("Error fetching transaction report:", error);
            });
        }
    }, []);

    return (
        <div id="trans_report">
            <h1 id="report_topic">Late Loan Installment Report</h1>
            <table id="trans_table">
                <thead>
                    <tr>
                        <th>Loan ID</th>
                        <th>Account ID</th>
                        <th>Installment ID</th>
                        <th>Amount (Rs)</th>
                        <th>Due date</th>
                        <th>Payment date</th>
                    </tr>
                </thead>
                <tbody>
                    {transaction_report.length > 0 ? (
                        transaction_report.map((val, key) => (
                            <tr key={key}>
                                <td>{val.loan_id}</td>
                                <td>{val.account_id}</td>
                                <td>{val.installment_id}</td>
                                <td>{val.amount}</td>
                                <td>{val.due_date}</td>
                                <td>{val.payment_date}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6">No loan reports available.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}