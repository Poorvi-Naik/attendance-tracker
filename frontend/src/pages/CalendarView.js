import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import API from "../api";

export default function CalendarView() {
  const [records, setRecords] = useState([]);
  const [selectedDateInfo, setSelectedDateInfo] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await API.get("/api/attendance/my-history");
        // res.data should be array of records where date is YYYY-MM-DD
        console.log("Calendar records:", res.data);
        setRecords(res.data);
      } catch (err) {
        console.log("Calendar error:", err);
      }
    }
    load();
  }, []);

  // Build fast lookup map (date -> record)
  const recordMap = {};
  records.forEach((r) => {
    // ensure key is exactly YYYY-MM-DD
    recordMap[r.date] = r;
  });

  // Convert JS Date -> YYYY-MM-DD in local timezone (en-CA gives YYYY-MM-DD)
  const toLocalYYYYMMDD = (date) => {
    return date.toLocaleDateString("en-CA"); // e.g. "2025-11-30"
  };

  // Format an ISO timestamp (or Date) to a human local date+time string
  // Example output: "30/11/2025, 10:23:14 AM"
  const formatLocalDateTime = (isoString) => {
    if (!isoString) return "-";
    const d = new Date(isoString);
    // Use en-GB for DD/MM/YYYY order; include time
    return d.toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  // If you just want time only (e.g. 10:23 AM) use:
  const formatLocalTimeOnly = (isoString) => {
    if (!isoString) return "-";
    const d = new Date(isoString);
    return d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: true });
  };

  // tile class based on record status
  const tileClassName = ({ date }) => {
    const d = toLocalYYYYMMDD(date); // YYYY-MM-DD
    const rec = recordMap[d];
    if (!rec) return "";

    if (rec.status === "present") return "day-present";
    if (rec.status === "absent") return "day-absent";
    if (rec.status === "late") return "day-late";
    if (rec.status === "half-day") return "day-half";
    return "";
  };

  // When user clicks a day
  const onDayClick = (date) => {
    const d = toLocalYYYYMMDD(date); // YYYY-MM-DD
    setSelectedDateInfo(recordMap[d] || { date: d, status: "No record" });
  };

  return (
    <div className="container mt-4">
      <h2 className="fw-bold mb-3">Attendance Calendar</h2>

      <Calendar onClickDay={onDayClick} tileClassName={tileClassName} />

      {/* Color styles (small, can be moved to CSS file) */}
      <style>{`
        .day-present { background: #c8f7c5 !important; }
        .day-absent  { background: #f7c5c5 !important; }
        .day-late    { background: #fff6c5 !important; }
        .day-half    { background: #f5d1a1 !important; }
      `}</style>

      {selectedDateInfo && (
        <div className="card shadow-sm mt-4 p-3">
          <h5>Date: {selectedDateInfo.date}</h5>
          <p>Status: {selectedDateInfo.status}</p>

          {/* show full local date/time */}
          {selectedDateInfo.checkInTime && (
            <p>Check In: {formatLocalDateTime(selectedDateInfo.checkInTime)}</p>
          )}

          {selectedDateInfo.checkOutTime && (
            <p>Check Out: {formatLocalDateTime(selectedDateInfo.checkOutTime)}</p>
          )}

          {/* If you prefer to show time only (and keep the 'Date' line above),
              replace the two lines above with:
              <p>Check In: {formatLocalTimeOnly(selectedDateInfo.checkInTime)}</p>
              <p>Check Out: {formatLocalTimeOnly(selectedDateInfo.checkOutTime)}</p>
          */}
        </div>
      )}
    </div>
  );
}
