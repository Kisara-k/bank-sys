import React from "react";
import { useState ,useEffect} from "react";
import Axios from 'axios';


export default function Account(){
    const [detail,setDetail]=useState([]);
   
    useEffect(()=>{
        const getData=localStorage.getItem("logdetails");
        if(getData){
            setDetail(JSON.parse(getData));
            console.log(detail);
            
        }
        
    },[]);
    
    console.log(detail);
    return(
        <>
        <p>log success!!!!!.This page use to create user profile.</p>

        </>
    )
}