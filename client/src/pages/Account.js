import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import './Account.css';
import Axios from 'axios';
import isTokenExpired from "./token_expire";

export default function Account() {
    const [detail, setDetail] = useState([]);
    const [Acc_ID, setID] = useState("");
    const [Acc_type, setType] = useState("");
    const [Balance, setBalance] = useState(0);
    const [customer_type, setCustomerType] = useState("");
    const [tranfer_amount, setTransAmount] = useState(0);
    const [tranferAcc, setTransAcc] = useState("");
    const [trans_detail, setTransDetail] = useState([]);

    useEffect(() => {
        const getData = localStorage.getItem("logdetails");
        if (getData) {
            const parsedData = JSON.parse(getData);
            setDetail(parsedData[0]);
            setID(parsedData[0].account_id);
            setType(parsedData[0].type);
            setCustomerType(parsedData[0].customer_type);
        }
    }, []);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (Acc_ID && token) {
            if (isTokenExpired(token)) {
                alert("Session expired. Please log in again.");
                window.location.href = "/";
                return;
            }
            Axios.get("http://localhost:3002/transaction/trans_detail", {
                params: { Id: Acc_ID },
                headers: { Authorization: `Bearer ${token}` }
            })
            .then((response) => {
                setTransDetail(response.data.transactions);
                setBalance(response.data.balance);
            })
            .catch((error) => {
                console.error("Error fetching transaction details:", error);
            });
        }
        if (Acc_type === "checking") {
            document.getElementById("fdBtn").style.display = "none";
        }
    }, [Acc_ID]);

    const linkto = customer_type === "organization" ? "/Profileo" : "/Profile";

    const transfer = () => {
        const token = localStorage.getItem("token");
        if (isTokenExpired(token)) {
            alert("Session expired. Please log in again.");
            window.location.href = "/";
            return;
        }

        if (tranfer_amount === 0) {
            document.getElementById("msgT").style.display = "block";
        }

        if (tranferAcc === "") {
            document.getElementById("msgt").style.display = "block";
        } else {
            Axios.post("http://localhost:3002/account/transfer", {
                from: Acc_ID,
                to: tranferAcc,
                amount: tranfer_amount,
                Acc_type: Acc_type,
            }, {
                headers: { Authorization: `Bearer ${token}` }
            }).then((response) => {
                if (response.data.success === 1) {
                    document.getElementById("transferSuccess").style.display = "block";
                    setBalance(response.data.Balance);
                } else if (response.data.success === 2) {
                    alert("Insufficient balance or minimum balance not met");
                }
            }).catch((error) => {
                console.error("Error during transfer:", error);
            });
        }
    };

    const fixedDepo = () => {
        window.location.href = "/FD";
    };
    const goATM = () => {
        window.location.href = "/atm";
    };

    const logout = () => {
        window.location.href = "/";
    };
    window.history.forward();

    return (
        <div>
           
            <nav id="nav2">
                <Link className="link2" to="/account">Home</Link>
                <Link className="link2" to="/loans">Loans</Link>
                <Link to={linkto}><img src="user.png" id="userImg" /></Link>
                <img src="logout.png" onClick={logout} id="logoutImg" />
                <input type="button" onClick={fixedDepo} id="fdBtn" value="start FD"></input>
                <input type="button" id="atmBtn" value="ATM" onClick={goATM}></input>
            </nav>
            
            <div className="row">
                <div id="detail" className="col-sm-4">
                    {[detail].map((value, key) => (
                        <div key={key}>
                            <span id="name">{value.first_name} {value.last_name} {value.name}</span><br></br>
                            <span id="acc">Acc no : </span><span id="accNo">{value.account_id}</span><br></br>
                        </div>
                    ))}
                </div>

                <div id="AccDetail" className="col-sm-4">
                    <span id="balance">Available Balance</span><br></br><br></br>
                    <span id="Rs"> Rs {Balance}</span>
                </div>
            </div>

            <div className="row" id="sections">
                <div className="col-sm-4" id="transfer">
                    <span id="T1">Transfer section</span><br></br><br></br>
                    <label htmlFor="DepositeAmount">To : </label>
                    <p><input type="text" className="form-control" onChange={(event) => { setTransAcc(event.target.value) }} id="AccTo" placeholder="AC001"></input></p><br></br>
                    <label htmlFor="transferMoney">Enter Amount :</label>
                    <p><input type="text" className="form-control" onChange={(event) => { setTransAmount(event.target.value); }} id="transfetAmount" placeholder="1000.00"></input></p>
                    <input type="submit" onClick={transfer} id="transferBtn" className="btn btn-info" value="Transfer"></input>
                    <span id="msgT">please enter amount!</span>
                    <span id="msgt">please enter account number!</span>
                </div>

                <div className="col-sm-4" id="history">
                    <div className="Transaction_detail">
                        <table>
                            <thead>
                                <tr>
                                    <th>Acc ID</th>
                                    <th>Type</th>
                                    <th>Amount</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {trans_detail.map((val, key) => {
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
                                            <td>{val.account_id}</td>
                                            <td style={{ color: textColor, fontWeight: 600, fontFamily: "monospace" }}>
                                                {val.type}
                                            </td>
                                            <td>{val.amount}</td>
                                            <td>{val.date}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div id="transferSuccess">
                <img src="check.png" id="sucImg"></img>
                <p>Your transfer request has been successed. Thank you!</p>
                <input type="button" onClick={() => window.location.href = "/account"} id="ok" value="OK" className="btn btn-info"></input>
            </div>
            </div>
        
    );
}