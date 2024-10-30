import React, { useEffect } from "react";
import { useState } from "react";
import Axios from "axios";
import './Bms.css';

export default function Bms(){

    const [employeeDetail,setEmployeeDetail]=useState([]);
    const [employeeType,setEmployeeType]=useState("");

    const [first_name,setFirstName]=useState("");
    const [last_name,setLastName]=useState("");
    const [bDay,setBday]=useState("");
    const [nic,setNic]=useState("");
    const [contactNo,setcontactNo]=useState("");
    const [email,setEmail]=useState("");
    const [address,setAddress]=useState("");
    const [passwordI,setPasswordI]=useState("");
    const [Acctype,setAccType]=useState("");
    const [Amount,setAmount]=useState("");
    const [Date,setDate]=useState("");
    const [branch_id,setBranch]=useState("");
    const [customerType,setCustomerType]=useState("");
    const [acc_no,setAccNo]=useState("");
    const [duration,setDuration]=useState("");

    const [reg_no,setRegNumber]=useState("");
    const [contPerson,setContactPerson]=useState("");
    const [position,setPosition]=useState("");

    const [em_id,setEmid]=useState("");
    const [branch,setbranch]=useState("");
    const [report,setReport]=useState("");

    const [viewOption,setoption]=useState("");
    const [number,setNumber]=useState("");
    const [reason,setReason]=useState("");

    useEffect(()=>{
        const getData=localStorage.getItem("employeeDetail");
        if(getData){
            const EmployeeData=JSON.parse(getData);
            setEmployeeDetail(EmployeeData);
            setBranch(EmployeeData[0].branch_id);
            setEmployeeType(EmployeeData[0].role);
            if(employeeType==="manager"){
                document.getElementById("employeeAdd").style.display="block";
                document.getElementById("managerOP").style.display="block";
                document.getElementById("loanManage").style.display="block";
            }
        }
    });

    const showCreate=()=>{
        document.getElementById("createForm").style.display="block";
    }

    const showCreateOrganization=()=>{
        document.getElementById("createorganizationForm").style.display="block";
    }

    const hideCreate=()=>{
        document.getElementById("createorganizationForm").style.display="none";
        document.getElementById("createForm").style.display="none";
        document.getElementById("addEmployee").style.display="none";
        document.getElementById("physical_loan").style.display="none";
    }

    const next1=()=>{
        document.getElementById("createForm").style.display="none";
        document.getElementById("AccDetailEnter").style.display="block";
        setCustomerType("individual");
    }

    const next2=()=>{
        document.getElementById("createorganizationForm").style.display="none";
        document.getElementById("AccDetailEnter").style.display="block";
        setCustomerType("organization")
    }

    const addEmployee=()=>{
        document.getElementById("addEmployee").style.display="block";
    }

    const loanApply=()=>{
        document.getElementById("physical_loan").style.display="block";
    }

    const createAcc=()=>{
        Axios.post("http://localhost:3002/customer/createAcc",{
            fname:first_name,
            lname:last_name,
            Bday:bDay,
            nic:nic,
            contactNo:contactNo,
            email:email,
            address:address,
            password:passwordI,
            Acctype:Acctype,
            Amount:Amount,
            Date:Date,
            customer_type:customerType,
            branch_id:branch_id,
            reg_no:reg_no,
            contPerson:contPerson,
            position:position
        }).then((response)=>{
            console.log(response.data);
            document.getElementById("addEmployee").style.display="none";
            if(response.data.success===1){
                document.getElementById("success_create").style.display="block";
            }
        })
    };

    const insertEmployee=()=>{
        Axios.post("http://localhost:3002/employee/insertEmployee",{
            em_id:em_id,
            name:first_name,
            role:"employee",
            branch_id:branch_id,
            password:passwordI,
            email:email,
            address:address,
            contactNo:contactNo
        }).then((response)=>{
            if(response.data.success===1){
                document.getElementById("success_employee").style.display="block";
            }
        })
    };

    const branch_transaction_report=()=>{
        if(branch===""){
            alert("please select branch first!!");
        }
        else{
            Axios.post("http://localhost:3002/transaction/trans_report",{
                branch_id:branch,
                report:report
            }).then((response)=>{
                localStorage.setItem("branch_transaction",JSON.stringify(response.data[0]));
                console.log(response.data);
                if(report==="1"){
                    window.location.href="/branch_transaction";
                }
                else{
                    window.location.href="/late_loan";
                }
                
            })
        }
        
    };

    const physical_loan=()=>{
        Axios.post("http://localhost:3002/loans/phy_loan",{
            acc_no:acc_no,
            amount:Amount,
            duration:duration,
            date:Date,
            reason:reason
        }).then((response)=>{
            if(response.data.success===1){
                document.getElementById("success_loan").style.display="block";
            }
        })

    };

    const viewData=()=>{
        if(number==="" || viewOption===""){
            alert("Enter input data to process");
        }
        else{
            Axios.post("http://localhost:3002/viewinfo",{
                no:number,
                viewOption:viewOption
            }).then((response)=>{
                if(response.data.outcome==="undefined" || response.data.outcome[0][0]===null){
                    alert("Invalid input entered!!!!");
                    return;
                }
                if(response.data.success===2){
                    localStorage.setItem("nicDetail",JSON.stringify(response.data.outcome));
                    window.location.href="NicDetail";
                }
                else if(response.data.success===3){
                    localStorage.setItem("regDetail",JSON.stringify(response.data.outcome));
                    window.location.href="RegDetail";
                }
                else if(response.data.success===1 && response.data.outcome[0][0].customer_type==="organization"){
                    localStorage.setItem("regDetail",JSON.stringify(response.data.outcome));
                    window.location.href="RegDetail";
                }
                else if(response.data.success===1 && response.data.outcome[0][0].customer_type==="individual"){
                    console.log("done");
                    localStorage.setItem("nicDetail",JSON.stringify(response.data.outcome));
                    window.location.href="NicDetail";
                }
                else{
                    alert("Invalid input entered!");
                }
                
            });
        }
    }

    const loanManage=()=>{
        window.location.href="/loanManage";
    }

    const ok=()=>{
        document.getElementById("success_create").style.display="none";
        window.location.href="/BMS";
    }
    const ok2=()=>{
        document.getElementById("success_employee").style.display="none";
        window.location.href="/BMS";
    }
    const ok3=()=>{
        document.getElementById("success_loan").style.display="none";
        window.location.href="/BMS";
    }
    return(
        <>
        <div id="full">
                <h1 id="BMSTopic">Bank Management System</h1>
                {/* Show employee detail */}
                <div id="employeeDetail" className="row">
                    {employeeDetail.map((val,key)=>(
                        <>
                        <div className="col-sm-4">
                            <span id="employeeID">Employee ID : {val.employee_id}</span><br></br>
                        </div>
                        <div className="col-sm-4">
                            <span id="emName">Name : {val.name}</span><br></br>
                        </div>
                        <div className="col-sm-4">
                            <span id="emRole">Role : {val.role}</span><br></br>
                        </div>
                        </>
                    ))}
                </div>

                    {/* Employee option panel */}
                <div className="row">
                    <div className="col" id="options">
                        <div className="row">
                            <input type="button" id="createBtn" onClick={showCreate}  value="Create new individual account"></input>
                        </div>
                        <div className="row">
                            <input type="button" id="createOrganizeBtn" onClick={showCreateOrganization}  value="Create new organization account"></input>
                        </div>
                        <div className="row">
                            <input type="button" id="loan2" onClick={loanApply} value="Apply a loan"></input>
                        </div>
                        <div className="row">
                            <input type="button" id="employeeAdd" onClick={addEmployee} value="Add new employee"></input>
                        </div>
                        <div className="row">
                            <input type="button" id="loanManage" onClick={loanManage} value="Manage loan system "></input>
                        </div>
                    </div>

                    <div className="col" id="reports">
                        <div id="branch_trans" className="row">
                            <label for="select branch">Branch wise transaction report :</label>
                            <div className="form-group">
                                <select id="branches" value={branch} onChange={(event)=>{setbranch(event.target.value);}} className="form-control">
                                    <option value="" disabled>choose branch :</option>
                                    <option value="1">Victoria</option>
                                    <option value="2" >Praslin</option>
                                    <option value="3" >Mahe</option>
                                    <option value="4" >La Digue</option>
                                    <option value="5" >Duba</option>
                                </select>
                            </div>

                            <div className="form-group" id="report">
                                <select id="reportType" value={report} onChange={(event)=>{setReport(event.target.value);}} className="form-control">
                                    <option value="" disabled>choose report type :</option>
                                    <option value="1">Transaction report</option>
                                    <option id="managerOP" value="2">late loan installments</option>
                                </select>
                            </div>
                            
                            <input type="button" className="btn btn-info" value="find report" onClick={branch_transaction_report} id="findBtn"></input>
                        </div>

                        <div id="view_detail" className="row">
                            <label for="select option">Customer detail view :</label>
                            <div className="form-group">
                                <select id="view_option" value={viewOption} onChange={(event)=>{setoption(event.target.value);}} className="form-control">
                                    <option value="" disabled>choose method :</option>
                                    <option value="1">Account no</option>
                                    <option value="2" >NIC no</option>
                                    <option value="3" >Registration no</option>
                                </select>
                            </div>

                            <div className="form-group" id="report">
                                <input className="form-control" type="text" id="Noenter" onChange={(event)=>{setNumber(event.target.value)}} placeholder="Enter number"></input>
                            </div>
                            
                            <input type="button" className="btn btn-info" value="view" onClick={viewData} id="viewBtn"></input>
                        </div>
                    </div>

                    
                </div>

                    {/* form for individual customer add*/}
                <div id="createForm">
                    <form>
                        <img src="close.png" id="closeimg" onClick={hideCreate}></img>
                        <h1>Create Individual Account</h1>
                        <div className="row">
                            <div className="col">
                                <div className="form-group">
                                    <label for="first_name">First name :</label>
                                    <input className="form-control" onChange={(event)=>{setFirstName(event.target.value)}} type="text" id="fname2"></input>
                                </div>
                            </div>
                            <div className="col">
                                <div className="form-group">
                                    <label for="last_name">Last name :</label>
                                    <input className="form-control" onChange={(event)=>{setLastName(event.target.value)}} type="text" id="lname2"></input>
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col">
                                <div className="form-group">
                                    <label for="birthday">Date of birth :</label>
                                    <input className="form-control" onChange={(event)=>{setBday(event.target.value)}} type="date" id="bday"></input>
                                </div>
                            </div>
                            <div className="col">
                                <div className="form-group">
                                    <label for="nic">NIC  no :</label>
                                    <input className="form-control" onChange={(event)=>{setNic(event.target.value)}} type="text" id="nic2"></input>
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col">
                                <div className="form-group">
                                    <label for="contactNo">Contact no :</label>
                                    <input className="form-control" onChange={(event)=>{setcontactNo(event.target.value)}} type="tel" id="phone"></input>
                                </div>
                            </div>
                            <div className="col">
                                <div className="form-group">
                                    <label for="contactNo">email :</label>
                                    <input className="form-control" onChange={(event)=>{setEmail(event.target.value)}} type="email" id="email2"></input>
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col">
                                <div className="form-group">
                                    <label for="contactNo">Address :</label>
                                    <input className="form-control" onChange={(event)=>{setAddress(event.target.value)}} type="text" id="address2"></input>
                                </div>
                            </div>
                            <div className="col">
                                <div className="form-group">
                                    <label for="contactNo">Password :</label>
                                    <input className="form-control" onChange={(event)=>{setPasswordI(event.target.value)}} type="password" id="address2"></input>
                                </div>
                            </div>
                        </div>

                        <div className="form-group">
                            <input type="button" className="btn btn-primary" id="next1" onClick={next1} value="next"></input>
                        </div>

                    </form>
                </div>

                    {/* form for organization customer add*/}
                <div id="createorganizationForm">
                    <form>
                        <img src="close.png" id="closeimg" onClick={hideCreate}></img>
                        <h1>Create Organization Account</h1>
                        <div className="row">
                            <div className="col">
                                <div className="form-group">
                                    <label for="organizationName">Organization name :</label>
                                    <input className="form-control" onChange={(event)=>{setFirstName(event.target.value)}} type="text" id="oname"></input>
                                </div>
                            </div>
                            <div className="col">
                                <div className="form-group">
                                    <label for="regNo">Registration no :</label>
                                    <input className="form-control" onChange={(event)=>{setRegNumber(event.target.value)}}  type="text" id="regNo"></input>
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col">
                                <div className="form-group">
                                    <label for="person">Contact person :</label>
                                    <input className="form-control" onChange={(event)=>{setContactPerson(event.target.value)}}  type="text" id="person"></input>
                                </div>
                            </div>
                            <div className="col">
                                <div className="form-group">
                                    <label for="position">Contact person position :</label>
                                    <input className="form-control" onChange={(event)=>{setPosition(event.target.value)}} type="text" id="position"></input>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                <div className="form-group">
                                    <label for="contactNo">Contact no :</label>
                                    <input className="form-control" onChange={(event)=>{setcontactNo(event.target.value)}} type="tel" id="phoneO"></input>
                                </div>
                            </div>
                            <div className="col">
                                <div className="form-group">
                                    <label for="contactNo">email :</label>
                                    <input className="form-control" onChange={(event)=>{setEmail(event.target.value)}} type="email" id="emailO"></input>
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col">
                                <div className="form-group">
                                    <label for="contactNo">Address :</label>
                                    <input className="form-control" onChange={(event)=>{setAddress(event.target.value)}} type="text" id="addressO"></input>
                                </div>
                            </div>
                            <div className="col">
                                <div className="form-group">
                                    <label for="contactNo">Password :</label>
                                    <input className="form-control" onChange={(event)=>{setPasswordI(event.target.value)}} type="password" id="passwordO"></input>
                                </div>
                            </div>
                        </div>

                        <div className="form-group">
                            <input type="button" className="btn btn-primary" id="next2" onClick={next2} value="next"></input>
                        </div>

                    </form>
                </div>

                    {/* Form for Acc detail insert*/}
                <div id="AccDetailEnter">
                    <h1>Enter Account Details</h1>
                    <form>
                        <div className="form-group">
                            <label for="accountType">Account type</label>
                            <select className="form-control" value={Acctype} onChange={(event)=>{setAccType(event.target.value)}} id="typeselect">
                                <option value="" disabled>Select Account Type</option>
                                <option value="saving">savings</option>
                                <option value="checking">checking</option>
                            </select>
                        </div>
                        <div className="form group">
                            <label for="amount">Amount</label>
                            <input type="number" id="amount" onChange={(event)=>{setAmount(event.target.value)}} className="form-control"></input>
                        </div>
                        <div className="form group">
                            <label for="">Start date</label>
                            <input type="date" id="startDate" onChange={(event)=>{setDate(event.target.value)}} className="form-control"></input>
                        </div>
                        <div className="form group">
                            <input type="button" id="createAccount" onClick={createAcc} className="form-control" value="create account"></input>
                        </div>
                    </form>
                </div>

                    {/* form for add new employee only visible to manager*/}
                <div id="addEmployee">
                    <h1>Add an employee to system</h1>
                    <img src="close.png" id="closeimg" onClick={hideCreate}></img>
                    <div className="row">
                        <div className="col">
                            <div className="form-group">
                                <label for="Em_id">Employee ID :</label>
                                <input type="text" onChange={(event)=>{setEmid(event.target.value);}} className="form-control" id="em_id"></input>
                            </div>
                        </div>
                        <div className="col">
                            <div className="form-group">
                                <label for="Em_name">Employee name :</label>
                                <input type="text" onChange={(event)=>{setFirstName(event.target.value);}} className="form-control" id="em_name"></input>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <div className="form-group">
                                <label for="Em_email">email :</label>
                                <input type="email" onChange={(event)=>{setEmail(event.target.value);}} className="form-control" id="em_email"></input>
                            </div>
                        </div>
                        <div className="col">
                            <div className="form-group">
                                <label for="Em_address">Address :</label>
                                <input type="text" onChange={(event)=>{setAddress(event.target.value);}} className="form-control" id="em_address"></input>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <div className="form-group">
                                <label for="Em_phone">contact No :</label>
                                <input type="text" onChange={(event)=>{setcontactNo(event.target.value);}} className="form-control" id="em_phone"></input>
                            </div>
                        </div>
                        <div className="col">
                            <div className="form-group">
                                <label for="Em_password">Employee password :</label>
                                <input type="password" onChange={(event)=>{setPasswordI(event.target.value);}} className="form-control" id="em_password"></input>
                            </div>
                        </div>
                    </div>
                    <div className="form-group">
                        <input type="button" onClick={insertEmployee} className="form-control" id="employee_Add" value="add employee"></input>
                    </div>
                </div>

                {/* form for apply loan */}
                <div id="physical_loan">
                    <img src="close.png" id="closeimg" onClick={hideCreate}></img>
                    <h1>Apply a loan</h1>
                    <div id="acc_no" className="form-group">
                        <label for="acc_no">Account no :</label>
                        <input type="text" onChange={(event)=>{setAccNo(event.target.value)}} id="lAcc" className="form-control"></input>
                    </div>
                    <div id="loanamount" className="form-group">
                        <label for="loanamount">loan amount :</label>
                        <input type="text" onChange={(event)=>{setAmount(event.target.value)}} id="loanamount" className="form-control"></input>
                    </div>
                    <div id="lduration" className="form-group">
                        <label for="lduration">duration months :</label>
                        <input type="number" onChange={(event)=>{setDuration(event.target.value)}} id="lduration" className="form-control"></input>
                    </div>
                    <div className="form group">
                            <label for="">Reason for loan</label>
                            <input type="text" id="loanreason" onChange={(event)=>{setReason(event.target.value)}} className="form-control"></input>
                    </div>
                    <div id="date" className="form-group">
                        <label for="date">Date :</label>
                        <input type="date" onChange={(event)=>{setDate(event.target.value)}} id="lDate" className="form-control"></input>
                    </div>

                    <input type="button" id="loanBtn" value="Apply" onClick={physical_loan} className="form-control"></input>
                </div>

                {/* success messages*/}
                <div id="success_create">
                    <img src="check.png" id="create_success"></img>
                    <p>account created successfull.</p>
                    <input id="createOk" className="btn btn-info" type="submit" value="ok" onClick={ok}></input>
                </div>

                <div id="success_employee">
                    <img src="check.png" id="em_success"></img>
                    <p>employee added successfully.</p>
                    <input id="addOk" className="btn btn-info" type="submit" value="ok" onClick={ok2}></input>
                </div>

                <div id="success_loan">
                    <img src="check.png" id="em_success"></img>
                    <p>loan apply successfully completed.</p>
                    <input id="loanOk" className="btn btn-info" type="submit" value="ok" onClick={ok3}></input>
                </div>

            </div>

       </>
    )
}
