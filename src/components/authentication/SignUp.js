import React, { useRef, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import "./Login.css";
import { useSnackbar } from "../common/SnackBar";
import { Link, useHistory } from "react-router-dom/cjs/react-router-dom.min";

function SignUp() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const { signup } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const { openSnackbar } = useSnackbar(); // Use the hook

  async function handleSubmit(e) {
    e.preventDefault();

    if (!emailRef.current.value.endsWith("@aurouniversity.edu.in")) {
      return setError("Please use your Auro University email");
    }

    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError("Passwords do not match");
    }

    try {
      setError("");
      setLoading(true);
      const userCredential = await signup(emailRef.current.value, passwordRef.current.value);
      // alert("Account created successfully");
      await userCredential.user.sendEmailVerification(); // Send verification email

      openSnackbar("Account created successfully. Please check your email to verify your account."); 
      history.push("/email-verify", { email: emailRef.current.value });
    } catch {
      setError("Failed to create an account");
    }

    setLoading(false);
  }

  return (
    <>
      <div className="login-container">
        <img
          src="/assets/abees.png"
          alt="AuroBees"
          className="onboarding-logo"
        />
        <h2>Sign Up</h2>
        {error && <p>{error}</p>}
        <form onSubmit={handleSubmit}>
          <input ref={emailRef} type="email" placeholder="Email" required />
          <input
            ref={passwordRef}
            type="password"
            placeholder="Password"
            required
          />
          <input
            ref={passwordConfirmRef}
            type="password"
            placeholder="Confirm Password"
            required
          />
          <button disabled={loading} type="submit">
            Sign Up
          </button>
        </form>
        <div>
          Already have an account? <Link to="/login">Log In</Link>
        </div>
      </div>
    </>
  );
}

export default SignUp;
