// App.js
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import TeamSummary from "./pages/TeamSummary";
import CalendarView from "./pages/CalendarView";
import Login from "./pages/Login";
import Register from "./pages/Register";
import EmployeeDashboard from "./pages/Employee_Dashboard";
import MarkAttendance from "./pages/Mark_Attendance";
import History from "./pages/History";
import ManagerDashboard from "./pages/Manager_Dashboard";
import Reports from "./pages/Reports";
import Profile from "./pages/Profile";
import TodayStatus from "./pages/TodayStatus";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Authentication */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Employee Routes */}
        <Route path="/employee" element={<EmployeeDashboard />} />
        <Route path="/employee/mark" element={<MarkAttendance />} />
        <Route path="/employee/history" element={<History />} />
        <Route path="/employee/calendar" element={<CalendarView />} />
        <Route path="/employee/profile" element={<Profile />} />

        {/* Manager Routes */}
        <Route path="/manager" element={<ManagerDashboard />} />
        <Route path="/manager/summary" element={<TeamSummary />} />
        <Route path="/manager/reports" element={<Reports />} />
        <Route path="/manager/today" element={<TodayStatus />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
