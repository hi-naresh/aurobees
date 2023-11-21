import React, { useRef, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Link, useHistory } from "react-router-dom";
import "./Login.css";
import { useSnackbar } from "../SnackBar";

const Login = () => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { login } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const { openSnackbar } = useSnackbar(); // Use the hook

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);
      await login(emailRef.current.value, passwordRef.current.value);
      openSnackbar("Login successfully"); // Use Snackbar instead of alert

      history.push("/swipe");
    } catch {
      setError("Failed to log in");
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
        <h2>Sign In</h2>
        {error && <p>{error}</p>}
        <form onSubmit={handleSubmit}>
          <input ref={emailRef} type="email" placeholder="Email" required />
          <input
            ref={passwordRef}
            type="password"
            placeholder="Password"
            required
          />
          <button disabled={loading} type="submit">
            Log In
          </button>
        </form>
        <div>
          Need an account? <Link to="/signup">Sign Up</Link>
        </div>
      </div>
    </>
  );
};

export default Login;
