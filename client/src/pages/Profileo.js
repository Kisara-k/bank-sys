import React from "react";
import { useState,useEffect } from "react";
import "./Profileo.css";

export default function Profileo(){
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
            <h2>Bank Account Details</h2>

            <div class="row" id="set2">
                <div id="Left2" class="col-sm-4">
                    {userDetail.map((val,key)=>(
                        <><span >Organization name : <input type="text" id="oname" placeholder={val.name}></input></span><br></br><br></br>
                        <span >Registration no : <input type="text" id="rno" placeholder={val.registration_no}></input></span><br></br><br></br>
                        <span >Contact person : <input type="text" id="cperson" placeholder={val.contact_person}></input></span><br></br><br></br>
                        <span >Contact person ID : <input type="text" id="cpersonid" placeholder={val.customer_id}></input></span><br></br><br></br>
                        <span>Contact no : <input type="text" id="no" placeholder={val.contact_number}></input></span><br></br><br></br>
                        <span>Contact person position : <input type="text" id="position" placeholder={val.contact_person_position}></input></span><br></br><br></br>
                        <span >Address : <input type="text" id="address" placeholder={val.address}></input></span><br></br><br></br>
                        <span>email : <input type="text" id="email" placeholder={val.email}></input></span><br></br></>
                    ))}
                </div>

                <div id="Right2" class="col-sm-4">
                    {userDetail.map((val,key)=>(
                        <><span >Account no : <span id="ac" >{val.account_id}</span></span><br></br><br></br>
                        <span >Account type : <span id="ac_type" >{val.type}</span></span><br></br><br></br>
                        <span >Branch ID : <span id="bid" >{val.branch_id}</span></span><br></br>
                        </>
                    ))}
                </div>
            </div>

            <div id="btns2">
                <span><input id="save" type="submit" className="btn btn-info" value="Save"></input>    <input id="back" type="submit" onClick={back} className="btn btn-info" value="Back"></input>  </span>
            </div>
            
        
        </>
    )
}