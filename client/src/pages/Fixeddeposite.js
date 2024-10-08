import React from "react";
import { useState,useEffect } from "react";

export default function Fixeddeposite(){

    const [accDetail,setDetail]=useState([]);

    useEffect(()=>{
        const AccData=localStorage.getItem("logdetails");
        if(AccData){
            const logData=JSON.parse(AccData);
            setDetail(logData);
        }
    })
    return(
        <p>FD</p>
    )
}