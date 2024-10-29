import React from 'react';
import { Link } from 'react-router-dom';
import './ATMProfile.css';

const ATMProfile = () => {
    return (
        <div className="atm-profile-container">
            <header>
                <h1 className="atm-profile-title">ATM Options</h1>
            </header>
            <section className="atm-buttons">
                    <Link to="/deposit" className="atm-button-link">
                        <button className="atm-button" aria-label="Deposit">Deposit</button>
                    </Link>
                    <Link to="/withdraw" className="atm-button-link">
                        <button className="atm-button" aria-label="Withdraw">Withdraw</button>
                    </Link>
            </section>
        </div>
    );
};

export default ATMProfile;