import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import './Account.css';
import Axios from 'axios';
import isTokenExpired from "./token_expire";
export default function Account() {
    const [detail, setDetail] = useState([]);
    const [withdraw_amount, setWithAmount] = useState(0);
    const [deposite_amounnt, setDepoAmount] = useState(0);
    const [Acc_ID, setID] = useState("");
    const [Acc_type, setType] = useState("");
    const [Balance, setBalance] = useState(0);
    const [customer_type, setCustomerType] = useState("");
    const [tranfer_amount, setTransAmount] = useState(0);
    const [tranferAcc, setTransAcc] = useState("");
    const [trans_detail, setTransDetail] = useState([]);

    useEffect(() => {
        const getData = localStorage.getItem("logdetails");
        console.log(getData);

        if (getData) {
            const pasedData = JSON.parse(getData);
            setDetail(pasedData[0]);
            console.log(pasedData);
            console.log("/////////");
            console.log("/////////",pasedData[0].account_id);
            setID(pasedData[0].account_id);
            setType(pasedData[0].type);
            setCustomerType(pasedData[0].customer_type);
        }
        console.log(Acc_ID);
    }, []);
    console.log("details :",detail);
    console.log("###########");
    [detail].map((value, key) => {
        console.log(value.account_id);
    });
    useEffect(() => {
        const token = localStorage.getItem("token");
        console.log("token: ",token);
        console.log("acc_id: ",Acc_ID);

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
                console.log(response.data);
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

    

    const withdraw = (event) => {
        event.preventDefault();
        const token = localStorage.getItem("token");

        if (isTokenExpired(token)) {
            alert("Session expired. Please log in again.");
            window.location.href = "/";
            return;
        }

        if (withdraw_amount === 0) {
            document.getElementById("msgW").style.display = "block";
        } else {
            Axios.post("http://localhost:3002/account/withdraw", {
                withdraw_amount: withdraw_amount,
                Acc_ID: Acc_ID,
                Acc_type: Acc_type,
            }, {
                headers: { Authorization: `Bearer ${token}` }
            }).then((response) => {
                console.log(response.data);
                if (response.data.success === 1) {
                    document.getElementById("withSuccess").style.display = "block";
                    setBalance(response.data.Balance);
                } else if (response.data.success === 0) {
                    alert("Insufficient balance or number of withdrawals not enough.");
                }
            }).catch((error) => {
                console.error("Error during withdrawal:", error);
            });
        }
    };

    const ok1 = () => {
        document.getElementById("withSuccess").style.display = "none";
        window.location.href = "/account";
    };
    const ok2 = () => {
        document.getElementById("depoSuccess").style.display = "none";
        window.location.href = "/account";
    };
    const ok3 = () => {
        document.getElementById("transferSuccess").style.display = "none";
        window.location.href = "/account";
    };

    const deposite = () => {
        const token = localStorage.getItem("token");

        if (isTokenExpired(token)) {
            alert("Session expired. Please log in again.");
            window.location.href = "/";
            return;
        }

        if (deposite_amounnt === 0) {
            document.getElementById("msgD").style.display = "block";
        } else {
            Axios.post("http://localhost:3002/account/deposite", {
                deposite_amount: deposite_amounnt,
                Acc_ID: Acc_ID,
                Acc_type: Acc_type,
            }, {
                headers: { Authorization: `Bearer ${token}` }
            }).then((response) => {
                if (response.data.success === 1) {
                    document.getElementById("depoSuccess").style.display = "block";
                    setBalance(response.data.Balance);
                }
            }).catch((error) => {
                console.error("Error during deposit:", error);
            });
        }
    };

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
                }else{
                    alert("Enter valid account number");
                }
            }).catch((error) => {
                console.error("Error during transfer:", error);
            });
        }
    };

    const fixedDepo = () => {
        window.location.href = "/FD";
    };
    const goATM=()=>{
        window.location.href = "/atm";
    }

    const logout = () => {
        window.location.href = "/";
    };
    window.history.forward();

    console.log(detail);
    return (
        <>
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
                    {[detail].map((value, key) => (
                        <div key={key}>
                            <span id="balance">Available Balance</span><br></br><br></br>
                            <span id="Rs"> Rs {Balance}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="row" id="sections">
                <div className="col" id="transaction">
                    <div className="row-sm-4" id="withdraw">
                        <span id="T1">Withdraw section</span><br></br><br></br>
                        <label for="withAmount">Enter amount : </label>
                        <p><input type="text" className="form-control" onChange={(event) => { setWithAmount(event.target.value); }} id="amountC" placeholder="5000.00"></input></p>
                        <span id="msgW">please enter amount!</span>
                        <input type="submit" onClick={withdraw} id="withBtn" value="withdraw"></input>
                    </div>

                    <div className="row-sm-4" id="Deposite">
                        <span id="T1">Deposite section</span><br></br><br></br>
                        <label for="DepositeAmount">Enter amount : </label>
                        <p><input type="text" className="form-control" onChange={(event) => { setDepoAmount(event.target.value); }} id="amountC" placeholder="5000.00"></input></p>
                        <span id="msgD">please enter amount!</span>
                        <input type="submit" onClick={deposite} id="withBtn" value="Deposite"></input>
                    </div>
                </div>

                <div className="col-sm-4" id="transfer">
                    <span id="T1">Transfer section</span><br></br><br></br>
                    <label for="DepositeAmount">To : </label>
                    <p><input type="text" className="form-control" onChange={(event) => { setTransAcc(event.target.value) }} id="AccTo" placeholder="AC001"></input></p><br></br>
                    <label for="transferMoney">Enter Amount :</label>
                    <p><input type="text" className="form-control" onChange={(event) => { setTransAmount(event.target.value); }} id="transfetAmount" placeholder="1000.00"></input></p>
                    <input type="submit" onClick={transfer} id="transferBtn" className="btn btn-info" value="Transfer"></input>
                    <span id="msgT">please enter amount!</span>
                    <span id="msgt">please enter account number!</span>
                </div>

                <div className="col-sm-4" id="history">
                    <div className="Transaction_detail">
                        <table>
                            <thead>
                                <th>Acc ID</th>
                                <th>Type</th>
                                <th>Amount</th>
                                <th>Date</th>
                            </thead>
                            <tbody>
                                {trans_detail.map((val, key) => {
                                    // Define colors based on transaction type
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

            <div id="withSuccess">
                <img src="check.png" id="sucImg"></img>
                <p>Your withdrawal request has been confirmed. Thank you!</p>
                <input type="button" onClick={ok1} id="ok" value="OK" className="btn btn-info"></input>
            </div>

            <div id="depoSuccess">
                <img src="check.png" id="sucImg"></img>
                <p>Your deposite request has been successed. Thank you!</p>
                <input type="button" onClick={ok2} id="ok" value="OK" className="btn btn-info"></input>
            </div>

            <div id="transferSuccess">
                <img src="check.png" id="sucImg"></img>
                <p>Your transfer request has been successed. Thank you!</p>
                <input type="button" onClick={ok3} id="ok" value="OK" className="btn btn-info"></input>
            </div>
        </>
    );
}