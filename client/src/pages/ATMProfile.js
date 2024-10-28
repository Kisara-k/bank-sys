import React from 'react';
import { Link } from 'react-router-dom';
import './ATMProfile.css';

// Reusable Button Component
const ATMButton = ({ to, label }) => (
    <Link to={to} className="atm-button-link">
        <button className="atm-button" aria-label={label}>
            {label}
        </button>
    </Link>
);

const ATMProfile = () => {
    return (
        <div className="atm-profile-container">
            <header>
                <h1 className="atm-profile-title">ATM</h1>
            </header>
            <section className="atm-buttons">
                <ATMButton to="/deposit" label="Deposit" />
                <ATMButton to="/withdraw" label="Withdraw" />
            </section>
        </div>
    );
};

export default ATMProfile;
