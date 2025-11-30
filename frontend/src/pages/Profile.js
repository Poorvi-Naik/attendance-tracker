import React, { useEffect, useState } from "react";
import API from "../api";

export default function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await API.get("/api/auth/me");
        setUser(res.data);
      } catch (err) {
        console.log("Profile load error:", err);
      }
    }
    load();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    window.location = "/";
  };

  if (!user) return <p className="text-center mt-4">Loading profile...</p>;

  return (
    <div className="container mt-4">
      <h2 className="fw-bold mb-3">My Profile</h2>

      <div className="card shadow-sm p-3">
        <h5 className="mb-3">Personal Information</h5>

        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Employee ID:</strong> {user.employeeId}</p>
        <p><strong>Department:</strong> {user.department}</p>
        <p><strong>Role:</strong> {user.role}</p>
        <p><strong>Joined:</strong> {user.createdAt?.slice(0, 10)}</p>

        <button className="btn btn-danger mt-3" onClick={logout}>
          Logout
        </button>
      </div>

      <a href="/employee" className="btn btn-outline-secondary mt-3">
        Back to Dashboard
      </a>
    </div>
  );
}
