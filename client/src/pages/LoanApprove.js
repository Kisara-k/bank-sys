import Axios from "axios";
import React, { useEffect, useState } from "react";
import "./LoanApprove.css";

export default function LoanApprove() {
    const [loanList, setLoanList] = useState([]);
    const [type, setType] = useState("");
    const [loanID,setLoanID]=useState("");
    const [customerLoanDetail,setDetail]=useState([]);
    const [manager_id,setManagerID]=useState("");
    const [acc_id,setID]=useState("");

    useEffect(()=>{
        const getData=localStorage.getItem("employeeDetail");
        if(getData){
            const EmployeeData=JSON.parse(getData);
            setManagerID(EmployeeData[0].employee_id);
        }
    })

    const show = () => {
        Axios.post("http://localhost:3002/loan_list", {
            type: type
        }).then((response) => {
            setLoanList(response.data);
        });
        document.getElementById("loan_detail").style.display = "block"; // Updated ID
        document.getElementById("loan_approve").style.display = "none";
    };

    const approve = () => {
        Axios.post("http://localhost:3002/approve", {
            loan_id: loanID
        }).then((response) => {
            setDetail(response.data);
            console.log(response.data)
    
            if (response.data && response.data.length > 0) {
                document.getElementById("approveBtn").style.display = "block";
            } else {
                document.getElementById("approveBtn").style.display = "none";
            }
        }).catch((error) => {
            console.error("Error approving loan:", error);
        });
    
        document.getElementById("loan_approve").style.display = "block";
        document.getElementById("loan_detail").style.display = "none";
    };
    

    const approveByManger=()=>{
        Axios.post("http://localhost:3002/manager_approve",{
            acc_id:acc_id,
            loan_id:loanID,
            manager_id:manager_id
        }).then((response)=>{
            if(response.data.success===1){
                document.getElementById("approveBtn").innerHTML = "Loan Approved";
            }
        })
    }

    return (
        <>
            <h1 id="report_topic">Loan Management System</h1>
            <div id="viewLoan" className="form-group">
                <label htmlFor="type">Select option:</label>
                <select id="typeSelect" value={type} onChange={(event) => { setType(event.target.value); }}>
                    <option value="" disabled className="form-control">select loan type</option>
                    <option value="1" className="form-control">online loan</option>
                    <option value="2" className="form-control">physical loan</option>
                </select>
                <input type="button" id="showloan" onClick={show} value="show" className="btn btn-primary"></input>
                <label for="loanDetailView" id="loanDetailView">Loan ID </label>
                <input type="text" id="loanIDEnter" onChange={(event)=>{setLoanID(event.target.value);}} ></input>
                <input type="button" className="btn btn-primary" id="getCustomerLoan" onClick={approve} value="see details"></input>
            </div>

            <div id="loan_detail" style={{ display: 'none' }}> {/* Initially hidden */}
                <table id="trans_table">
                    <thead>
                        <tr>
                            <th>Loan ID</th>
                            <th>Amount</th>
                            <th>Account ID</th>
                            <th>Rate</th>
                            <th>Duration (months)</th>
                            <th>Start date</th>
                            <th>Loan type</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loanList.map((val, key) => {
                            return (
                                <tr key={key}>
                                    <td>{val.loan_id}</td>
                                    <td>{val.amount}</td>
                                    <td>{val.account_id}</td>
                                    <td>{val.rate}</td>
                                    <td>{val.duration_months}</td>
                                    <td>{val.start_date}</td>
                                    <td>{val.type}</td>
                                    <td>{val.status}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <div id="loan_approve" style={{ display: 'none' }}> {/* Initially hidden */}
                <table id="trans_table">
                    <thead>
                        <tr>
                            <th>Loan ID</th>
                            <th>Amount</th>
                            <th>Account ID</th>
                            <th>Rate</th>
                            <th>Duration (months)</th>
                            <th>Start date</th>
                            <th>Loan type</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {customerLoanDetail.map((val, key) => {
                            return (
                                <tr key={key}>
                                    <td>{val.loan_id}</td>
                                    <td>{val.amount}</td>
                                    <td>{val.account_id}</td>
                                    <td>{val.rate}</td>
                                    <td>{val.duration_months}</td>
                                    <td>{val.start_date}</td>
                                    <td>{val.type}</td>
                                    <td>{val.status}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                <input type="button" className="btn btn-primary" onClick={approveByManger} id="approveBtn" value="approve"></input>
            </div>
           
        </>
    );
}
