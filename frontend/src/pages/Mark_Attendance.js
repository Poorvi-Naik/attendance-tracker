import React, { useState } from "react";
import API from "../api";

export default function MarkAttendance() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleCheckIn = async () => {
    setLoading(true);
    setMessage("");

    try {
      await API.post("/api/attendance/checkin");
      setMessage("✔ Checked in successfully!");
    } catch (err) {
      setMessage(err.response?.data?.message || "Error while checking in");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async () => {
    setLoading(true);
    setMessage("");

    try {
      await API.post("/api/attendance/checkout");
      setMessage("✔ Checked out successfully!");
    } catch (err) {
      setMessage(err.response?.data?.message || "Error while checking out");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 350, margin: "40px auto", padding: 20 }}>
      <h2 style={{ textAlign: "center" }}>Mark Attendance</h2>

      <div style={{ marginTop: 20 }}>
        <button
          onClick={handleCheckIn}
          disabled={loading}
          style={{
            padding: "10px 18px",
            marginRight: 10,
            cursor: "pointer",
          }}
        >
          Check In
        </button>

        <button
          onClick={handleCheckOut}
          disabled={loading}
          style={{
            padding: "10px 18px",
            cursor: "pointer",
          }}
        >
          Check Out
        </button>
      </div>

      {/* Status Message */}
      {message && (
        <p
          style={{
            marginTop: 20,
            color: message.startsWith("✔") ? "green" : "red",
          }}
        >
          {message}
        </p>
      )}

      {/* Loading State */}
      {loading && <p style={{ marginTop: 10 }}>Processing...</p>}
    </div>
  );
}
