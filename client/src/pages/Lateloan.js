import Axios from "axios";
import React, { useEffect, useState } from "react";
import "./LoanApprove.css";
import isTokenExpired from "./token_expire";

export default function LoanApprove() {
    const [loanList, setLoanList] = useState([]);
    const [type, setType] = useState("");
    const [loanID, setLoanID] = useState("");
    const [customerLoanDetail, setDetail] = useState([]);
    const [manager_id, setManagerID] = useState("");
    const [acc_id, setID] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        const getData = localStorage.getItem("employeeDetail");
        if (getData) {
            const EmployeeData = JSON.parse(getData);
            setManagerID(EmployeeData[0].employee_id);
        }
    }, []);

    const show = () => {
        const token = localStorage.getItem("token"); // Retrieve token from localStorage
            if (isTokenExpired(token)) {
                alert("Session expired. Please log in again.");
                window.location.href = "/";
                return;
            }
        Axios.post("http://localhost:3002/loan_list", {
            type: type
        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}` // Add token to headers
            }
        }).then((response) => {
            setLoanList(response.data);
        });
        document.getElementById("loan_detail").style.display = "block"; // Updated ID
        document.getElementById("loan_approve").style.display = "none";
    };

    const approve = () => {
        document.getElementById("loanmsg").style.display = "none";
        Axios.post("http://localhost:3002/approve", {
            loan_id: loanID
        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}` // Add token to headers
            }
        }).then((response) => {
            setDetail(response.data);

            if (response.data && response.data.length > 0) {
                setID(response.data[0].account_id);
                document.getElementById("approveBtn").style.display = "block";
                document.getElementById("rejectBtn").style.display = "block";
            } else {
                document.getElementById("rejectBtn").style.display = "none";
                document.getElementById("approveBtn").style.display = "none";
            }
        }).catch((error) => {
            console.error("Error approving loan:", error);
        });

        document.getElementById("loan_approve").style.display = "block";
        document.getElementById("loan_detail").style.display = "none";
    };

    const approveByManger = () => {
        Axios.post("http://localhost:3002/manager_approve", {
            acc_id: acc_id,
            loan_id: loanID,
            manager_id: manager_id
        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}` // Add token to headers
            }
        }).then((response) => {
            if (response.data.success === 1) {
                setMessage(response.data.message);
                document.getElementById("loanmsg").style.backgroundColor = "rgb(144, 238, 144)";
                document.getElementById("loanmsg").style.display = "block";
            } else {
                setMessage(response.data.message);
                document.getElementById("loanmsg").style.backgroundColor = "rgb(255, 204, 204)";
                document.getElementById("loanmsg").style.display = "block";
            }
        });
    };

    const rejectByManger = () => {
        Axios.post("http://localhost:3002/manager_reject", {
            loan_id: loanID,
            acc_id: acc_id,
            manager_id: manager_id
        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}` // Add token to headers
            }
        }).then((response) => {
            if (response.data.success === 1) {
                setMessage(response.data.message);
                document.getElementById("loanmsg").style.backgroundColor = "rgb(144, 238, 144)";
                document.getElementById("loanmsg").style.display = "block";
            } else {
                setMessage(response.data.message);
                document.getElementById("loanmsg").style.backgroundColor = "rgb(255, 204, 204)";
                document.getElementById("loanmsg").style.display = "block";
            }
        });
    };

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
                <label htmlFor="loanDetailView" id="loanDetailView">Loan ID </label>
                <input type="text" id="loanIDEnter" onChange={(event) => { setLoanID(event.target.value); }}></input>
                <input type="button" className="btn btn-primary" id="getCustomerLoan" onClick={approve} value="see details"></input>
            </div>

            <div id="loan_detail" style={{ display: 'none' }}>
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
                            let textColor;
                            if (val.status === 'overdue') {
                                textColor = 'red';
                            } else if (val.status === 'pending') {
                                textColor = 'rgba(233, 161, 17, 0.765)';
                            } else if (val.status === 'approved') {
                                textColor = 'rgb(29, 200, 29)';
                            } else if (val.status === 'paid') {
                                textColor = 'blue';
                            }
                            return (
                                <tr key={key}>
                                    <td>{val.loan_id}</td>
                                    <td>{val.amount}</td>
                                    <td>{val.account_id}</td>
                                    <td>{val.rate}</td>
                                    <td>{val.duration_months}</td>
                                    <td>{val.start_date}</td>
                                    <td>{val.type}</td>
                                    <td style={{ color: textColor, fontWeight: "600" }}>{val.status}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <div id="loan_approve" style={{ display: 'none' }}>
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
                <input type="button" className="btn btn-success" onClick={approveByManger} id="approveBtn" value="approve"></input>
                <input type="button" className="btn btn-danger" onClick={rejectByManger} id="rejectBtn" value="reject"></input>
                <div id="loanmsg">
                    <span>{message}</span>
                </div>
            </div>
        </>
    );
}
