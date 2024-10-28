import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Link } from 'react-router-dom';
import './Home.css';
import Axios from 'axios';

export default function Home() {
    const [username, setUsername] = useState("");
    const [passkey, setPasskey] = useState("");
    const [logdetails, setLogdetails] = useState([]);

    const log = (event) => {
        event.preventDefault();

        Axios.post("http://localhost:3002/auth/log", {
            username: username,
            passkey: passkey,
        }).then((response) => {
            console.log(response.data); // Log the response data

            // Destructure the token and result from the response
            
            const token = response.data.token; 
            const result = response.data.result;
            console.log("token is ",token)
            console.log("result is ",result.length);// Extract the token from the response
            
            // Check if the result array is empty, indicating an invalid login
            if (result.length === 0) {
                console.log("Invalid input");
                document.getElementById("err").style.display = "block"; // Show error message
            } else {
                // Save the token in localStorage and the result in state
                localStorage.setItem("token", token);
                localStorage.setItem("customer_id",result[0].customer_id) // Store token
                setLogdetails(result); // Store login details in state
                localStorage.setItem("logdetails", JSON.stringify(result)); // Store login details in localStorage

                // Redirect to the account page
                window.location.href = "/account";
            }
        }).catch((error) => {
            console.log(error); // Log any errors during the request
            document.getElementById("err").style.display = "block";
        });
    };

    const gotoBMS = () => {
        window.location.href = "bmslogin"; // Redirect to BMS login
    };

    return (
        <>
            <div className="row">
                <div className="col-sm-4" id="left">
                    <nav id="nav">
                        
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
                                onChange={(event) => setUsername(event.target.value)}
                                className="form-control"
                                id="user"
                                placeholder="Username"
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="password"
                                onChange={(event) => setPasskey(event.target.value)}
                                className="form-control"
                                id="pass"
                                placeholder="Password"
                            />
                        </div>

                        <div id="msg">
                            <a href="#">Forgot password?</a>
                        </div>

                        <div id="err" style={{ display: 'none' }}>
                            <span id="errMsg">Enter correct username and password. Try again.</span>
                        </div>

                        <button type="submit" onClick={log} className="btn btn-primary" id="btn">Login</button>
                    </form>
                </div>
            </div>
        </>
    );
}
