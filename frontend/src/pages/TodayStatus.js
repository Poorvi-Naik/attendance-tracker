import React, { useEffect, useState } from "react";
import API from "../api";
import { formatDateOnly } from "../utils/formatDate";


export default function TodayStatus() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await API.get("/api/attendance/today-status");
        setList(res.data.present || []);
      } catch (err) {
        console.log("Error loading today's status:", err);
      }
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <p className="text-center mt-4">Loading...</p>;

  return (
    <div className="container mt-4">
      <h2 className="fw-bold mb-3">Today's Attendance</h2>

      <div className="card shadow-sm">
        <div className="card-body">

          {list.length === 0 && (
            <p className="text-center mt-3">No employees checked in today.</p>
          )}

          {list.length > 0 && (
            <table className="table table-bordered">
              <thead className="table-dark">
                <tr>
                  <th>Employee ID</th>
                  <th>Name</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>
                {list.map((r) => (
                  <tr key={r._id}>
                    <td>{r.userId?.employeeId}</td>
                    <td>{r.userId?.name}</td>
                    <td>
                      <span className="badge bg-success">Present</span>
                    </td>
                    <td>{formatDateOnly(r.date)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <a href="/manager" className="btn btn-outline-secondary mt-3">
            Back
          </a>
        </div>
      </div>
    </div>
  );
}
