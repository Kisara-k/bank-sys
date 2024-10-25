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
            <h1 id="report_topic">Branch Wise Transaction Report</h1>
            <table id="trans_table">
                <thead>
                    <th>Transaction ID</th>
                    <th>Sender acc no</th>
                    <th>Amount</th>
                    <th>Sender acc type</th>
                    <th>Receiver acc no</th>
                    <th>Transaction date</th>
                </thead>
                {transaction_report.map((val,key)=>{
                    let textColor;
                    if (val.type === 'withdrawal') {
                        textColor = 'red';
                    } else if (val.type === 'transfer') {
                        textColor = 'rgba(233, 161, 17, 0.765)';
                    } else if (val.type === 'deposit') {
                        textColor = 'rgb(29, 200, 29)';
                    }
                    return(
                        <tr key={key}>
                            <td>{val.transaction_id}</td>
                            <td>{val.account_id}</td>
                            <td>{val.amount}</td>
                            <td style={{color:textColor,fontWeight:"600"}}>{val.type}</td>
                            <td>{val.receive_transaction_id}</td>
                            <td>{val.date}</td>
                        </tr>
                    )
                })}
            </table>
        </div>
    )
}