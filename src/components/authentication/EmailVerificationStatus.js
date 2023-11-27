import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import {firebase} from '../../firebase'; // Make sure this import is correct
import './EmailVerificationStatus.css';
import { useAuth } from '../../contexts/AuthContext';

function EmailVerificationStatus() {
  const [emailVerified, setEmailVerified] = useState(false);
  const history = useHistory();
  const { currentUser } = useAuth(); // useAuth might be providing the stale user object

  useEffect(() => {
    if (!currentUser) {
      history.push('/signup');
      return;
    }

    const intervalId = setInterval(async () => {
      // Manually fetch the latest user object from Firebase
      const freshUser = firebase.auth().currentUser;
      await freshUser.reload();
      const isVerified = freshUser.emailVerified;

      console.log("Email verified: ", isVerified); // Log for debugging
      if (isVerified) {
        setEmailVerified(true);
        clearInterval(intervalId);
      }
    }, 2000);

    return () => clearInterval(intervalId);
  }, [currentUser, history]);

  const handleContinue = () => {
    if (emailVerified) {
      history.push('/personal-details');
    } else {
      alert('Please verify your email before continuing.');
    }
  };

  return (
    <div className="verification-container">
      <h2>Email Verification</h2>
      {emailVerified ? (
        <p>Your email has been verified! <span className="verified-flag">✓</span></p>
      ) : (
        <p>Please verify your email to continue. Check your inbox for the verification email.</p>
      )}
      <button className='fixed-next-button' onClick={handleContinue} disabled={!emailVerified}>Continue</button>
    </div>
  );
}

export default EmailVerificationStatus;
