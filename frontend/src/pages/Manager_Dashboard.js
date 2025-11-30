import { formatDateOnly, formatTimeOnly } from "../utils/formatDate";
import React, { useEffect, useState } from "react";
import API from "../api";

export default function ManagerDashboard() {
  const [records, setRecords] = useState([]);
  const [employees, setEmployees] = useState([]);

  const [filterEmp, setFilterEmp] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const res = await API.get("/api/attendance/all");
      setRecords(res.data);

      // SAFE employee extraction
      const empList = res.data
        .filter((r) => r.userId && r.userId._id) // skip nulls
        .map((r) => r.userId)
        .filter(
          (user, index, arr) =>
            arr.findIndex((x) => x._id === user._id) === index
        );

      setEmployees(empList);

    } catch (err) {
      console.log("Error loading records:", err);
    }
  }

  // Export CSV
  const exportCSV = async () => {
    try {
      const res = await API.get("/api/attendance/export", {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "attendance.csv");
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      console.log(err);
      alert("Failed to export CSV");
    }
  };

  // Filters
  const filtered = records.filter((r) => {
    return (
      (filterEmp ? r.userId?.name === filterEmp : true) &&
      (filterDate ? r.date === filterDate : true) &&
      (filterStatus ? r.status === filterStatus : true)
    );
  });

  return (
    <div className="container mt-4">
      <h2 className="fw-bold mb-3">Manager Dashboard</h2>

      {/* Filters */}
      <div className="card shadow-sm p-3 mb-4">
        <h5>Filters</h5>

        <div className="row mt-3">
          {/* Employee Filter */}
          <div className="col-md-4">
            <label className="form-label">Employee</label>
            <select
              className="form-select"
              value={filterEmp}
              onChange={(e) => setFilterEmp(e.target.value)}
            >
              <option value="">All</option>

              {employees.map((emp) => (
                <option key={emp._id} value={emp.name}>
                  {emp.name} ({emp.employeeId})
                </option>
              ))}
            </select>
          </div>

          {/* Date Filter */}
          <div className="col-md-4">
            <label className="form-label">Date</label>
            <input
              type="date"
              className="form-control"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
            />
          </div>

          {/* Status Filter */}
          <div className="col-md-4">
            <label className="form-label">Status</label>
            <select
              className="form-select"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">All</option>
              <option value="present">Present</option>
              <option value="absent">Absent</option>
              <option value="late">Late</option>
              <option value="half-day">Half-Day</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card shadow-sm">
        <div className="card-body">
          <h5 className="mb-3">Attendance Records</h5>

          <p>
            <a href="/manager/reports" className="btn btn-outline-dark mb-3">
              View Reports
            </a>

            <a href="/manager/summary" className="btn btn-outline-primary mb-3 ms-2">
              View Team Summary
            </a>

            <a href="/manager/today" className="btn btn-outline-warning mb-3 ms-2">
              View Today's Status
            </a>
          </p>

          <table className="table table-bordered">
            <thead className="table-dark">
              <tr>
                <th>Employee ID</th>
                <th>Name</th>
                <th>Date</th>
                <th>Status</th>
                <th>Check In</th>
                <th>Check Out</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((r) => (
                <tr key={r._id}>
                  <td>{r.userId?.employeeId || "—"}</td>
                  <td>{r.userId?.name || "—"}</td>
                  <td>{formatDateOnly(r.date)}</td>
                  <td>{r.status}</td>
                  <td>{formatTimeOnly(r.checkInTime)}</td>
                  <td>{formatTimeOnly(r.checkOutTime)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <button className="btn btn-success mt-3" onClick={exportCSV}>
            Export CSV
          </button>
        </div>
      </div>
    </div>
  );
}
