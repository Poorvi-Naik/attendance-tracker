import React, { useEffect, useState } from "react";
import API from "../api";
import { formatDateOnly, formatTimeOnly } from "../utils/formatDate";
import "../App.css"; // Make sure CSS loads

export default function EmployeeHistory() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHistory() {
      try {
        const res = await API.get("/api/attendance/my-history");
        setRecords(res.data);
        setLoading(false);
      } catch (err) {
        console.log("History error:", err);
      }
    }
    loadHistory();
  }, []);

  if (loading) return <h3 className="text-center mt-5">Loading...</h3>;

  return (
    <div className="container mt-4">
      <h2 className="fw-bold mb-4 text-white">My Attendance History</h2>

      <div className="card shadow-sm">
        <div className="card-body">
          <table className="table table-bordered history-table">
            <thead className="table-dark">
              <tr>
                <th>Date</th>
                <th>Status</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Total Hours</th>
              </tr>
            </thead>

            <tbody>
              {records.map((r) => (
                <tr key={r._id}>
                  <td>{formatDateOnly(r.date)}</td>
                  <td>{r.status}</td>
                  <td>{formatTimeOnly(r.checkInTime)}</td>
                  <td>{formatTimeOnly(r.checkOutTime)}</td>
                  <td>{r.totalHours || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <a href="/employee" className="btn btn-primary mt-3">
            Back to Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}
