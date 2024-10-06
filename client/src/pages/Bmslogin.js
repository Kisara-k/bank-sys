import React from "react";
import './Bmslogin.css';
import { useState } from "react";
import Axios  from "axios";


export default function Bmslogin(){

    const [employeeId,setEmployeeId]=useState('');
    const [employeepasskey,setEmployeePasskey]=useState('');

    const login=(event)=>{
        event.preventDefault();
        if(employeeId==="" || employeepasskey===""){
            alert("Please enter your login details.")
        }
        Axios.post("http://localhost:3002/employeelog",{
            employeeId:employeeId,
            employeepasskey:employeepasskey
        }).then((response)=>{
            if(response.data.length===1){
                localStorage.setItem("employeeDetail",JSON.stringify(response.data));
                window.location.href="BMS";
            }
            else{
                alert("Please enter valid login details.");
            }
            
        })
    }

    return(
        <>
            <div id="body">
               
                <form id="form2">
                     <h1>BMS Login</h1>
                    <div id="input1" className="form-group">
                        <label for="userid">Enter employee id:</label>
                        <input type="text" onChange={(event)=>{setEmployeeId(event.target.value);}} id="f1" className="form-control"></input>
                    </div>

                    <div id="input2" className="form-group">
                        <label for="passkey">Enter passkey</label>
                        <input type="password" onChange={(event)=>{setEmployeePasskey(event.target.value);}} className="form-control" id="f2"></input>
                    </div>

                    <input type="submit" onClick={login} className="btn btn-primary" value="Login" id="emlog"></input>
                    
                </form>
            </div>

        </>
    )
}