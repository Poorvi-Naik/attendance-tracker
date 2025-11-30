// Login.js
import React, { useState } from "react";
import API, { setAuthToken } from "../api";
import "../App.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await API.post("/api/auth/login", { email, password });
      const token = res.data.token;

      // Save token
      localStorage.setItem("token", token);
      setAuthToken(token);

      // Fetch logged-in user
      const me = await API.get("/api/auth/me");

      // Redirect based on role
      if (me.data.role === "Manager") {
        window.location = "/manager";
      } else {
        window.location = "/employee";
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed";
      setError(msg);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">

        <h1 className="auth-title">Login</h1>

        {/* Fake fields prevent autofill */}
        <input type="text" name="fakeUser" className="fake-input" />
        <input type="password" name="fakePass" className="fake-input" />

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>

          <label className="auth-label">Email</label>
          <input
            type="email"
            className="auth-input"
            autoComplete="off"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label className="auth-label">Password</label>
          <div className="password-wrapper">
            <input
              type={showPass ? "text" : "password"}
              className="auth-input"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              className="toggle-pass"
              onClick={() => setShowPass(!showPass)}
            >
              {showPass ? "👁️" : "👁️‍🗨️"}
            </span>
          </div>

          <button className="auth-btn">Login</button>
        </form>

        <p className="auth-footer">
          Don’t have an account? <a href="/register">Register</a>
        </p>
      </div>
    </div>
  );
}
