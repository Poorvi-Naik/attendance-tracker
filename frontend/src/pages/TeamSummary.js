import React, { useEffect, useState } from "react";
import API from "../api";

export default function TeamSummary() {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({});

  useEffect(() => {
    async function load() {
      try {
        const res = await API.get("/api/attendance/summary");
        // res.data is expected to be an object keyed by userId
        setSummary(res.data || {});
      } catch (err) {
        console.error("Failed to load team summary", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <p className="text-center mt-4">Loading team summary...</p>;

  // Convert summary object to array for mapping
  const rows = Object.keys(summary).map((k) => {
    const v = summary[k];
    return {
      id: k,
      name: v.name || "-",
      employeeId: v.employeeId || "-",
      department: v.department || "-",
      present: v.present || 0,
      absent: v.absent || 0,
      late: v.late || 0,
      halfDay: v.halfDay || 0,
      totalHours: v.totalHours || 0,
    };
  });

  return (
    <div className="container mt-4">
      <h2 className="fw-bold mb-3">Team Summary</h2>

      <div className="card shadow-sm mb-3">
        <div className="card-body">
          <p className="mb-0">Here is a quick summary of attendance by employee.</p>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          <table className="table table-bordered">
            <thead className="table-dark">
              <tr>
                <th>Employee ID</th>
                <th>Name</th>
                <th>Department</th>
                <th>Present</th>
                <th>Absent</th>
                <th>Late</th>
                <th>Half-Day</th>
                <th>Total Hours</th>
              </tr>
            </thead>

            <tbody>
              {rows.length === 0 && (
                <tr>
                  <td colSpan="8" className="text-center">No data</td>
                </tr>
              )}

              {rows.map((r) => (
                <tr key={r.id}>
                  <td>{r.employeeId}</td>
                  <td>{r.name}</td>
                  <td>{r.department}</td>
                  <td>{r.present}</td>
                  <td>{r.absent}</td>
                  <td>{r.late}</td>
                  <td>{r.halfDay}</td>
                  <td>{r.totalHours}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <a href="/manager" className="btn btn-outline-secondary mt-3">Back to Manager Dashboard</a>
        </div>
      </div>
    </div>
  );
}
