import { formatDateOnly, formatTimeOnly } from "../utils/formatDate";
import React, { useEffect, useState } from "react";
import API from "../api";

export default function EmployeeDashboard() {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [todayStatus, setTodayStatus] = useState({});
  const [recent, setRecent] = useState([]);

  // Load Data
  useEffect(() => {
    async function loadData() {
      try {
        // Monthly summary
        const s = await API.get("/api/attendance/my-summary");
        setSummary(s.data);

        // Today status
        const t = await API.get("/api/attendance/today");

        // FIXED: extract record only
        setTodayStatus(t.data.record || {});

        // Recent 7 days
        const r = await API.get("/api/attendance/my-history");
        setRecent(r.data.slice(0, 7));

        setLoading(false);
      } catch (err) {
        console.log("Dashboard error:", err);
      }
    }
    loadData();
  }, []);

  // Check-In
  const checkIn = async () => {
    try {
      await API.post("/api/attendance/checkin");
      alert("Checked In!");
      window.location.reload();
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  // Check-Out
  const checkOut = async () => {
    try {
      await API.post("/api/attendance/checkout");
      alert("Checked Out!");
      window.location.reload();
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  if (loading)
    return <p className="text-center mt-5">Loading dashboard...</p>;

  // FIXED today display
  const todayDisplay =
    todayStatus?.checkOutTime
      ? "Checked Out"
      : todayStatus?.checkInTime
      ? "Checked In"
      : "Not Checked In";

  const todayBadgeColor =
    todayDisplay === "Checked Out"
      ? "bg-secondary"
      : todayDisplay === "Checked In"
      ? "bg-success"
      : "bg-danger";

  return (
    <div className="container mt-4">
      <h2 className="fw-bold mb-4 text-center">Employee Dashboard</h2>

      {/* Today's Status */}
      <div className="card shadow-sm mb-4">
        <div className="card-body d-flex justify-content-between align-items-center">
          <h5 className="m-0">Today's Status:</h5>

          <span
            className={`badge px-3 py-2 ${todayBadgeColor}`}
            style={{ fontSize: "1rem" }}
          >
            {todayDisplay}
          </span>
        </div>
      </div>

      {/* Buttons */}
      <div className="d-flex gap-3 mb-4">
        <button className="btn btn-primary w-50" onClick={checkIn}>
          Check In
        </button>
        <button className="btn btn-danger w-50" onClick={checkOut}>
          Check Out
        </button>
      </div>

      {/* Summary */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card shadow-sm text-center p-3">
            <h6>Present</h6>
            <h3>{summary.present}</h3>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm text-center p-3">
            <h6>Absent</h6>
            <h3>{summary.absent}</h3>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm text-center p-3">
            <h6>Late</h6>
            <h3>{summary.late}</h3>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm text-center p-3">
            <h6>Total Hours</h6>
            <h3>{summary.totalHours}</h3>
          </div>
        </div>
      </div>

      {/* Recent Attendance */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h4 className="mb-3">Recent Attendance</h4>

          <table className="table table-bordered">
            <thead className="table-dark">
              <tr>
                <th>Date</th>
                <th>Status</th>
                <th>Check In</th>
                <th>Check Out</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((r) => (
                <tr key={r._id}>
                  <td>{formatDateOnly(r.date)}</td>
                  <td>{r.status}</td>
                  <td>{formatTimeOnly(r.checkInTime)}</td>
                  <td>{formatTimeOnly(r.checkOutTime)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <a href="/employee/history" className="btn btn-outline-primary mt-3">
            View Full History
          </a>

          <a
            href="/employee/calendar"
            className="btn btn-outline-secondary mt-3 ms-3"
          >
            View Calendar
          </a>

          <a
            href="/employee/profile"
            className="btn btn-outline-dark mt-3 ms-3"
          >
            View Profile
          </a>
        </div>
      </div>
    </div>
  );
}
