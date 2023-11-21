import React from 'react';
import { Link } from 'react-router-dom';
import './Onboarding.css'; // Make sure this is uncommented

const Onboarding = () => {
    return (
        <div className="onboarding-container">
            <img src="/assets/abees.png" alt="AuroBees" className="onboarding-logo" />
            <h1>Welcome to AuroBees</h1>
            <p>Find your perfect match at Auro University</p>
            <div className="onboarding-buttons">
                <Link to="/login" className="btn btn-primary">Sign In</Link>
                <Link to="/signup" className="btn btn-secondary">Sign Up</Link>
            </div>
        </div>
    );
};

export default Onboarding;
