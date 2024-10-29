import React, { useState, useEffect } from "react";
import './Fixeddeposit.css';
import Axios from "axios";
import isTokenExpired from "./token_expire";

export default function Fixeddeposite() {
    const [accDetail, setDetail] = useState([]);
    const [getID, setID] = useState("");
    const [acc_type, setAccType] = useState("");

    const [acc_id, setAccId] = useState("");
    const [plan, setPlan] = useState("");
    const [date, setDate] = useState("");
    const [amount, setAmount] = useState("");

    useEffect(() => {
        const AccData = localStorage.getItem("logdetails");
        if (AccData) {
            const logData = JSON.parse(AccData);
            setDetail(logData);
            setID(logData[0].account_id);
            setAccType(logData[0].type);
        }
    }, []);

    const goBack = () => {
        window.location.href = "account";
    };

    const FixedDeposite = () => {
        console.log(getID, acc_id);
        if (getID == acc_id) {
            const token = localStorage.getItem("token");
            if (isTokenExpired(token)) {
                alert("Session expired. Please log in again.");
                window.location.href = "/";
                return;
            }
            Axios.post("http://localhost:3002/transaction/fixdepo", {
                acc_id: acc_id,
                plan: plan,
                date: date,
                amount: amount,
                acc_type: acc_type
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then((response) => {
                if (response.data.success === 1) {
                    document.getElementById("success_msg").style.display = "block";
                } else if (response.data.success === 0) {
                    document.getElementById("error_msg").style.display = "block";
                } else {
                    document.getElementById("error_msg2").style.display = "block";
                }
            });
        }
    };

    const ok = () => {
        document.getElementById("success_msg").style.display = "none";
        window.location.href = "/account";
    };
    const ok2 = () => {
        document.getElementById("error_msg").style.display = "none";
        window.location.href = "/account";
    };
    const ok3 = () => {
        document.getElementById("error_msg2").style.display = "none";
    };

    return (
        <div id="fdPage">
            {/* FD Plans Section */}
            <div id="fdPlansSection">
                <h2 >Enjoy</h2>
                <h2 >High Returns with </h2>
                
                <h2>Fixed Deposits</h2>
                <div style={{ marginBottom: "20px" }}></div> {/* Added gap */}
                <ul>
                    <li><h1>13% → 6 months</h1></li>
                    <li><h1>14% → 12 months</h1></li>
                    <li><h1>15% → 36 months</h1></li>
                </ul>
            </div>

            <form id="fdForm">
                <div className="form-group"></div>
                <div className="form-group">
                    <label htmlFor="account_id">Enter account no :</label>
                    <input type="text" onChange={(event) => { setAccId(event.target.value); }} className="form-control" id="account_id"></input>
                </div>
                <div className="form-group">
                    <select id="fdplans" value={plan} onChange={(event) => { setPlan(event.target.value); }}>
                        <option value="" disabled>choose a FD plan</option>
                        <option value="1">13% 6 months</option>
                        <option value="2">14% 12 months</option>
                        <option value="3">15% 36 months</option>
                    </select>
                </div>
                <div id="fdDate" className="form-group">
                    <label htmlFor="date">start date</label>
                    <input type="date" onChange={(event) => { setDate(event.target.value); }} className="form-control" id="fdDate"></input>
                </div>
                <div id="fdAmount" className="form-group">
                    <label htmlFor="amount">FD amount :</label>
                    <input type="text" onChange={(event) => { setAmount(event.target.value); }} className="form-control" id="fdAmount"></input>
                </div>
                <input type="button" id="startFD" onClick={FixedDeposite} className="btn btn-secondary" value="start FD"></input>
                <input type="button" onClick={goBack} id="backFD" className="btn btn-info" value="back"></input>
            </form>

            {/* Messages */}
            <div id="success_msg">
                <img src="check.png" id="fdsuccess" alt="success"></img>
                <p>fixed deposit created successfully.</p>
                <input id="fdOk" className="btn btn-info" type="submit" value="ok" onClick={ok}></input>
            </div>

            <div id="error_msg">
                <img src="error.png" id="fderror" alt="error"></img>
                <p>Error starting fixed deposit. Please check account balance is sufficient!</p>
                <input id="fderror" className="btn btn-info" type="submit" value="ok2" onClick={ok2}></input>
            </div>
            <div id="error_msg2">
                <img src="error.png" id="fderror" alt="error"></img>
                <p>Error starting fixed deposit. Please check input details!</p>
                <input id="fderror" className="btn btn-info" type="submit" value="ok2" onClick={ok3}></input>
            </div>
        </div>
    );
}
