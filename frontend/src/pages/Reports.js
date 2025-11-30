import React, { useEffect, useState } from "react";
import API from "../api";
import { formatDateOnly, formatTimeOnly } from "../utils/formatDate";


export default function Reports() {
  const [records, setRecords] = useState([]);
  const [employees, setEmployees] = useState([]);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [employee, setEmployee] = useState("");

  useEffect(() => {
    loadEmployees();
    loadRecords();
  }, []);

  async function loadEmployees() {
    try {
      const res = await API.get("/api/attendance/all");
      const unique = res.data
        .map((r) => r.userId)
        .filter((v, idx, arr) => v && arr.findIndex((e) => e._id === v._id) === idx);
      setEmployees(unique);
    } catch (err) {
      console.log("Error loading employees:", err);
    }
  }

  async function loadRecords() {
    try {
      const res = await API.get("/api/attendance/all");
      setRecords(res.data);
    } catch (err) {
      console.log("Error loading records:", err);
    }
  }

  // Filtering
  const filtered = records.filter((r) => {
    const dateOK =
      (!startDate || r.date >= startDate) &&
      (!endDate || r.date <= endDate);

    const empOK = employee ? r.userId?._id === employee : true;

    return dateOK && empOK;
  });

  // Export button
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


  return (
    <div className="container mt-4">
      <h2 className="fw-bold mb-4">Attendance Reports</h2>

      {/* Filters */}
      <div className="card shadow-sm p-3 mb-4">
        <h5>Filters</h5>
        <div className="row mt-3">

          {/* Start Date */}
          <div className="col-md-4">
            <label>Start Date</label>
            <input
              type="date"
              className="form-control"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          {/* End Date */}
          <div className="col-md-4">
            <label>End Date</label>
            <input
              type="date"
              className="form-control"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          {/* Employee */}
          <div className="col-md-4">
            <label>Employee</label>
            <select
              className="form-select"
              value={employee}
              onChange={(e) => setEmployee(e.target.value)}
            >
              <option value="">All Employees</option>
              {employees.map((emp) => (
                <option key={emp._id} value={emp._id}>
                  {emp.name} ({emp.employeeId})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card shadow-sm">
        <div className="card-body">
          <h5 className="mb-3">Report Result</h5>

          <table className="table table-bordered">
            <thead className="table-dark">
              <tr>
                <th>Employee ID</th>
                <th>Name</th>
                <th>Date</th>
                <th>Status</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Total Hours</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r._id}>
                <td>{r.userId?.employeeId}</td>
                <td>{r.userId?.name}</td>
                <td>{formatDateOnly(r.date)}</td>
                <td>{r.status}</td>
                <td>{formatTimeOnly(r.checkInTime)}</td>
                <td>{formatTimeOnly(r.checkOutTime)}</td>
                <td>{r.totalHours || 0}</td>
                </tr>

              ))}
            </tbody>
          </table>

          {/* Export Button */}
          <button className="btn btn-success mt-3" onClick={exportCSV}>
            Export CSV
          </button>

          {/* Back Button */}
          <a href="/manager" className="btn btn-outline-secondary mt-3 ms-3">
            Back
          </a>
        </div>
      </div>
    </div>
  );
}
