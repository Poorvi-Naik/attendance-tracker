import React, { useState } from "react";
import API from "../api";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Employee");
  const [employeeId, setEmployeeId] = useState("");
  const [department, setDepartment] = useState("IT");

  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/api/auth/register", {
        name,
        email,
        password,
        role,
        employeeId: role === "Employee" ? employeeId : null,
        department,
      });

      alert("User registered successfully!");
      window.location.href = "/login";
    } catch (err) {
      setError(err.response?.data?.message || "Error during registration");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "500px" }}>
      <h2 className="text-center mb-4 fw-bold">Register</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        
        <label>Full Name</label>
        <input
          className="form-control mb-3"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <label>Email</label>
        <input
          className="form-control mb-3"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Password</label>
        <input
          className="form-control mb-3"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <label>Role</label>
        <select
          className="form-control mb-3"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="Employee">Employee</option>
          <option value="Manager">Manager</option>
        </select>

        <label>Employee ID (EMP001)</label>
        <input
          className="form-control mb-3"
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
          required={role === "Employee"} // ONLY required for Employee
          disabled={role === "Manager"}   // Disable for Manager
          placeholder={
            role === "Manager" ? "Not required for managers" : "EMP001"
          }
        />

        <label>Department</label>
        <input
          className="form-control mb-3"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          required
        />

        <button className="btn btn-primary w-100 mt-3" type="submit">
          Register
        </button>
      </form>
    </div>
  );
}
