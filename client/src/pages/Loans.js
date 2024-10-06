import React from "react";
import { Link } from "react-router-dom";
import './Loans.css';

export default function Loans(){
    return(
        <>

            <nav id="nav2">
                        
                <Link className="link2" to="/account">Home</Link>
                <Link className="link2" to="/loans">Loans</Link>
            </nav>

            <div id="top">
                <span id="x1">Are you</span><br></br>
                <span id="x2">looking for</span><br></br>
            </div>

            <div className="row" id="icons">
                <div className="col-sm-4" id="personal">
                    <img src="personal.png" id="personalImg"></img><br></br>
                    <span id="d1">Personal/Business Loans</span>
                </div>

                <div className="col-sm-4" id="deposite">
                    <img src="deposit.png" id="personalImg"></img><br></br>
                    <span id="d1">Need a fixed deposite</span>
                </div>

                <div className="col-sm-4" id="loan">
                    <img src="capital.png" id="personalImg"></img><br></br>
                    <span id="d1">Loan upto 60% of FD</span>
                </div>
            </div>

            <div id="loanDetail">
                <p>Our loan management system allows employees to log in securely and create loan requests using a standard application form. Once submitted, the loan requires branch manager approval before it is confirmed. For customers, we offer a special online loan system, where loans can be applied for instantly without manager approval. Customers with an existing Fixed Deposit (FD) can apply for a loan up to 60% of their FD’s value, with a maximum limit of 500,000. Upon approval, the loan amount is directly deposited into the savings account linked to the FD.</p>
            </div>
            
            <div id="loanform">
                <h1 id="loanhead"> Loan Application___</h1>
                <form>
                    <div className="form-group">
                        <label for="acc">Enter account no:</label>
                        <input type="text" className="form-control" id="accNo"></input>
                    </div>
                    <div className="form-group">
                        <label for="loan type">select loan type:</label>
                        <select className="form-control" id="ltype">
                            <option>Personal loan</option>
                            <option>Business loan</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label for="duration">select duration</label>
                        <select className="form-control" id="duration">
                            <option>6 months</option>
                            <option>12 months</option>
                            <option>24 months</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label for="amount">Loan amount:</label>
                        <input type="text" className="form-control" id="lamount"></input>
                    </div>

                    <div className="form-group">
                        <input className="form-control" id="reqBtn" type="button" value="request loan"></input>
                    </div>
                </form>
            </div>
        
        </>
    )
}