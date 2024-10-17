import React from "react";
import { useState,useEffect } from "react";
import './BranchReport.css';

export default function BranchReport(){

    const [transaction_report,setReport]=useState([]);

    useEffect(()=>{
        const report=localStorage.getItem("branch_transaction");
        if(report){
            const branch_report=JSON.parse(report);
            setReport(branch_report);
            console.log(transaction_report);
        }
    })
    return(
        <div id="trans_report">
            <h1 id="report_topic">Late Loan Installment Report</h1>
            <table id="trans_table">
                <thead>
                <th>Loan ID</th>
                        <th>Account ID</th>
                        <th>Installment ID</th>
                        <th>Amount (Rs)</th>
                        <th>Due date</th>
                        <th>Payment date</th>
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
    )
}