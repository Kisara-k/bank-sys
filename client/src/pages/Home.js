import React from "react";
import { BrowserRouter as Router, Link } from 'react-router-dom';
import './Home.css';
import { useState } from "react";
import Axios from 'axios';

export default function Home() {
    const [username, setUsername] = useState("");
    const [passkey, setPasskey] = useState("");
    const [logdetails, setLogdetails] = useState([]);

    const log = (event) => {
        event.preventDefault();
        Axios.post("http://localhost:3002/log", {
            username: username,
            passkey: passkey,
        }).then((response) => {
            console.log(response.data);
            setLogdetails(response.data);

            if (response.data.length === 0) {
                console.log("Invalid input");
                document.getElementById("err").style.display = "block";
            } else {
                localStorage.setItem("logdetails", JSON.stringify(response.data));
                window.location.href = "account";
            }
        }).catch((error) => {
            console.log(error);
        });
    };

    const gotoBMS = () => {
        window.location.href = "bmslogin";
    };

    return (
        <>
        <div className="row">
            <div className="col-sm-4" id="left">
                <nav id="nav">
                    <Link className="link" to="/">Home</Link>
                    <Link className="link" to="/branches">Branches</Link>
                    <Link className="link" to="/loans">Loans</Link> {/* This will navigate to Loans */}
                    <Link className="link" to="/contact">Contact Us</Link>
                    <input type="button" value="BMS" onClick={gotoBMS} id="BMS"></input>
                </nav>
            </div>

            <div className="col-sm-4" id="form">
                <span id="log">Login</span>
                <p id="intro">Enter your username and password to log in</p>

                <form>
                    <div className="form-group">
                        <input
                            type="text"
                            onChange={(event) => { setUsername(event.target.value); }}
                            className="form-control"
                            id="user"
                            placeholder="Username"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="password"
                            onChange={(event) => { setPasskey(event.target.value); }}
                            className="form-control"
                            id="pass"
                            placeholder="Password"
                            required
                        />
                    </div>

                    <div id="msg">
                        <a href="#">Forgot password?</a>
                    </div>

                    <div id="err" style={{ display: 'none' }}>
                        <span id="errMsg">*Enter correct username and password. Try again.</span>
                    </div>

                    <button type="submit" onClick={log} className="btn btn-primary" id="btn">Login</button>
                </form>
            </div>

            {/* Adding the loan icon section */}
            <div className="col-sm-4" id="loan-section">
                <Link to="/loan-application"> {/* Redirects to loan application */}
                    <img src="/path-to-loan-icon.png" alt="Loan Icon" id="loan-icon" />
                    <p>Apply for a Loan</p>
                </Link>
            </div>
        </div>
        </>
    );
}
