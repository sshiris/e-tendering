import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login({ handleLogin }) {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutTime, setLockoutTime] = useState(null);

  useEffect(() => {
    const savedIdentifier = localStorage.getItem("rememberedIdentifier");
    const savedPassword = localStorage.getItem("rememberedPassword");
    const attempts = parseInt(localStorage.getItem("loginAttempts") || "0", 10);
    const lockoutTimestamp = localStorage.getItem("lockoutTime");

    if (savedIdentifier && savedPassword) {
      setIdentifier(savedIdentifier);
      setPassword(savedPassword);
      setRememberMe(true);
    }

    setLoginAttempts(attempts);

    if (lockoutTimestamp) {
      const timeLeft = parseInt(lockoutTimestamp, 10) + 60 * 1000 - Date.now();
      if (timeLeft > 0) {
        setIsLocked(true);
        setLockoutTime(timeLeft);
      } else {
        localStorage.removeItem("lockoutTime");
        localStorage.setItem("loginAttempts", "0");
        setLoginAttempts(0);
      }
    }
  }, []);

  useEffect(() => {
    if (isLocked && lockoutTime) {
      const timer = setInterval(() => {
        const timeLeft =
          parseInt(localStorage.getItem("lockoutTime"), 10) +
          5 * 60 * 1000 -
          Date.now();
        if (timeLeft <= 0) {
          setIsLocked(false);
          setLockoutTime(null);
          setLoginAttempts(0);
          localStorage.removeItem("lockoutTime");
          localStorage.setItem("loginAttempts", "0");
        } else {
          setLockoutTime(timeLeft);
        }
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isLocked, lockoutTime]);

  const determineIdentifierType = (value) => {
    return value.includes("@") ? "email" : "user_id";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset any previous error

    if (isLocked) {
      setError(`Account locked. Try again in ${Math.ceil(lockoutTime / 1000)} seconds.`);
      return;
    }

    try {
      const identifierType = determineIdentifierType(identifier);
      const email = identifierType === "email" ? identifier : "";
      const id = identifierType === "user_id" ? identifier : "";

      // Assuming handleLogin will set the user information and also check credentials
      await handleLogin(email, password, id);

      // Store the user data in localStorage after successful login
      if (rememberMe) {
        localStorage.setItem("rememberedIdentifier", identifier);
        localStorage.setItem("rememberedPassword", password);
      } else {
        localStorage.removeItem("rememberedIdentifier");
        localStorage.removeItem("rememberedPassword");
      }

      // Reset login attempts and redirect
      localStorage.setItem("loginAttempts", "0");
      setLoginAttempts(0);
      navigate("/tenders"); // Redirect after successful login
    } catch (err) {
      const newAttempts = loginAttempts + 1;
      setLoginAttempts(newAttempts);
      localStorage.setItem("loginAttempts", newAttempts.toString());

      if (newAttempts >= 3) {
        setIsLocked(true);
        const lockoutStart = Date.now();
        localStorage.setItem("lockoutTime", lockoutStart.toString());
        setLockoutTime(5 * 60 * 1000); // Account locked for 5 minutes
        setError("Too many failed attempts. Account locked for 5 minutes.");
      } else {
        setError(err.message || `Login failed. ${3 - newAttempts} attempts remaining.`);
      }
    }
  };

  const handleRememberMeChange = (e) => {
    setRememberMe(e.target.checked);
  };

  return (
    <div className="login-container">
      <h2 className="heading">Login</h2>
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label htmlFor="identifier">Email or User ID</label>
          <input
            id="identifier"
            type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="Enter your email or user ID"
            required
            disabled={isLocked}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
            disabled={isLocked}
          />
        </div>
        <div className="forgot-password-container">
          <a
            className="forgot-password"
            onClick={() =>
              window.alert(`Maybe you can send us some email \u{1F62D}`)
            }
          >
            Forgot password?
          </a>
        </div>
        <button type="submit" className="login-button" disabled={isLocked}>
          Login
        </button>
        <div className="footer">
          <label className="remember-me">
            <input
              type="checkbox"
              checked={rememberMe}
              name="remember"
              onChange={handleRememberMeChange}
              disabled={isLocked}
            />
            Remember me
          </label>
          <button
            type="button"
            className="cancel-btn"
            onClick={() => navigate("/")}
          >
            Cancel
          </button>
        </div>
        <div className="register-container">
          <p>
            Don’t have an account?{" "}
            <span
              className="register-link"
              onClick={() => navigate("/create-user")}
            >
              Register here
            </span>
          </p>
        </div>
      </form>
    </div>
  );
}

export default Login;