import React from "react";
import {BrowserRouter as Router,Routes,Switch,Link,Route} from 'react-router-dom';
import './Home.css';
import { useState } from "react";
import Axios from 'axios';

export default function Home(){
    const [username,setUsername]=useState("");
    const [passkey,setPasskey]=useState("");
    const [logdetails,setLogdetails]=useState([]);

    const log=(event)=>{
        event.preventDefault();
        Axios.post("http://localhost:3002/log",{
            username:username,
            passkey:passkey,
        }).then((response)=>{
            console.log(response.data);
            setLogdetails(response.data);

            if(response.data.length==0){
                console.log("invalid input");
                document.getElementById("err").style.display="block";
            }else{
                localStorage.setItem("logdetails",JSON.stringify(response.data));
                window.location.href="account";
            }
        }).catch((error)=>{
            console.log(error);
        })
        
    }

    const gotoBMS=()=>{
        window.location.href="bmslogin";
    }

    return(
        <>
        <div className="row">
            <div className="col-sm-4" id="left">
                <nav id="nav">
                        
                    <Link className="link" to="/">Home</Link>
                    <Link className="link" to="/branches">Branches</Link>
                    <Link className="link" to="/loan">Loans</Link>
                    <Link className="link" to="/contact">Contact Us</Link>
                    <input type="button" value="BMS" onClick={gotoBMS} id="BMS"></input>
                </nav>
            </div>

            <div className="col-sm-4" id="form">
                <span id="log">Login</span>
                <p id="intro">Enter your user name and password to log</p>

                <form>
                    <div className="form-group">
                        <input type="text" onChange={(event)=>{setUsername(event.target.value);}} className="form-control" id="user" aria-describedby="emailHelp" placeholder="Username"></input>
                        
                    </div>
                    <div className="form-group">
                        <input type="password" onChange={(event)=>{setPasskey(event.target.value);}} className="form-control" id="pass" placeholder="Password"></input>
                    </div>

                    <div id="msg">
                        <a href="#">Forgot password ?</a>
                    </div>

                    <div id="err">
                        <span id="errMsg">*Enter correct username and passwors.Try again</span>
                    </div>

                    <button type="submit" onClick={log} className="btn btn-primary" id="btn">Login</button>
                    </form>
            </div>
        </div>
        </>
    )
}