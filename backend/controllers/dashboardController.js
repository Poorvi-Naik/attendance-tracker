const Attendance = require('../models/Attendance');
const User = require('../models/User');

const todayStr = () => new Date().toISOString().slice(0, 10);


// ---------------------- EMPLOYEE DASHBOARD ----------------------
exports.employeeDashboard = async (req, res) => {
  try {
    const userId = req.user._id;
    const today = todayStr();

    // Today’s attendance record (if any)
    const todayStatus = await Attendance.findOne({ userId, date: today });

    // Recent 30 attendance records
    const records = await Attendance.find({ userId })
      .sort({ date: -1 })
      .limit(30);

    // Build attendance summary
    const summary = {
      present: 0,
      absent: 0,
      late: 0,
      halfDay: 0,
      totalHours: 0,
    };

    records.forEach((r) => {
      if (r.status === 'present') summary.present++;
      if (r.status === 'absent') summary.absent++;
      if (r.status === 'late') summary.late++;
      if (r.status === 'half-day') summary.halfDay++;

      summary.totalHours += r.totalHours || 0;
    });

    // Send dashboard data
    return res.json({
      todayStatus,
      summary,
      recent: records.slice(0, 7),   // Last 7 days preview for charts/cards
    });
  } catch (err) {
    console.error('Employee dashboard error:', err.message);
    return res.status(500).json({ message: 'Server error' });
  }
};


// ---------------------- MANAGER DASHBOARD ----------------------
exports.managerDashboard = async (req, res) => {
  try {
    const today = todayStr();

    // All employees marked today
    const todayAttendance = await Attendance.find({ date: today })
      .populate('userId', 'name employeeId department');

    // Total employees in system
    const employees = await User.find({ role: 'employee' });

    const totalEmployees = employees.length;
    const presentCount = todayAttendance.length;
    const absentCount = totalEmployees - presentCount;

    return res.json({
      totalEmployees,
      present: presentCount,
      absent: absentCount,
      todayRecords: todayAttendance,
    });
  } catch (err) {
    console.error('Manager dashboard error:', err.message);
    return res.status(500).json({ message: 'Server error' });
  }
};
