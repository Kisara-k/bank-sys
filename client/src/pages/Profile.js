import React from "react";
import { useState,useEffect } from "react";
import "./Profile.css";

export default function Profile(){
    const [userDetail,setDetail]=useState([]);

    useEffect(()=>{
        const getData=localStorage.getItem("logdetails");
        if(getData){
            const DataArray=JSON.parse(getData);
            setDetail(DataArray);
        }
    })

    const save=()=>{

    }

    const back=()=>{
        window.location.href="account";
    }

    return(
        <>
            <h2 style={{ fontFamily: "'Times New Roman', Times, serif", textAlign: "center" }}>Bank Account Details</h2>

            <div class="row" id="set">
                <div id="Left" class="col-sm-4">
                    {userDetail.map((val,key)=>(
                        <><span >First Name : <input type="text" id="fname" placeholder={val.first_name}></input></span><br></br><br></br>
                        <span >Last Name : <input type="text" id="lname" placeholder={val.last_name}></input></span><br></br><br></br>
                        <span >Date of birth : <input type="text" id="bd" placeholder={val.date_of_birth}></input></span><br></br><br></br>
                        <span>Contact no : <input type="text" id="no" placeholder={val.contact_number}></input></span><br></br><br></br>
                        <span >Address : <input type="text" id="address" placeholder={val.address}></input></span><br></br><br></br>
                        <span>email : <input type="text" id="email" placeholder={val.email}></input></span><br></br></>
                    ))}
                </div>

                <div id="Right" class="col-sm-4">
                    {userDetail.map((val,key)=>(
                        <><span >Account no : <span id="ac" >{val.account_id}</span></span><br></br><br></br>
                        <span >Account type : <span id="ac_type" >{val.type}</span></span><br></br><br></br>
                        <span >NIC no : <span id="nic"> {val.nic}</span></span><br></br><br></br>
                        <span >Branch ID : <span id="bid" >{val.branch_id}</span></span><br></br>
                        </>
                    ))}
                </div>
            </div>

            <div id="btns" style={{ textAlign: "center" }}>
                <span><input id="save" type="submit" className="btn btn-info" value="Save"></input>    <input id="back" type="submit" onClick={back} className="btn btn-info" value="Back"></input>  </span>
            </div>
            
        
        </>
    )
}