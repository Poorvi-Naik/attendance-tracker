// controllers/attendanceController.js
const Attendance = require('../models/Attendance');
const User = require('../models/User');

// Returns YYYY-MM-DD in local timezone
const todayStr = () => {
  const d = new Date();
  const offset = d.getTimezoneOffset();
  const local = new Date(d.getTime() - offset * 60000);
  return local.toISOString().split("T")[0];
};

// CHECK-IN
exports.checkIn = async (req, res) => {
  try {
    const userId = req.user._id;
    const date = todayStr();

    // Check if already checked in
    let record = await Attendance.findOne({ userId, date });
    if (record) {
      return res.status(400).json({ message: "Already checked in today" });
    }

    const now = new Date();

    // Office time rules
    const officeStart = new Date();
    officeStart.setHours(9, 30, 0, 0); // 9:30 AM

    const halfDayLimit = new Date();
    halfDayLimit.setHours(12, 0, 0, 0); // 12:00 PM

    let status = "present";

    if (now > halfDayLimit) {
      status = "half-day";
    } else if (now > officeStart) {
      status = "late";
    }

    record = new Attendance({
      userId,
      date,
      checkInTime: now.toISOString(), // store as ISO string
      status,
    });

    await record.save();
    return res.json(record);
  } catch (err) {
    console.error("Check-in error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// CHECK-OUT
exports.checkOut = async (req, res) => {
  try {
    const userId = req.user._id;
    const date = todayStr();

    const record = await Attendance.findOne({ userId, date });
    if (!record) {
      return res.status(400).json({ message: "No check-in found for today" });
    }

    if (record.checkOutTime) {
      return res.status(400).json({ message: "Already checked out today" });
    }

    const now = new Date();
    record.checkOutTime = now.toISOString(); // store ISO string

    const checkIn = new Date(record.checkInTime);
    const hoursWorked = (now - checkIn) / (1000 * 60 * 60);

    record.totalHours = Number(hoursWorked.toFixed(2));

    await record.save();
    return res.json(record);
  } catch (err) {
    console.error("Check-out error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// MY HISTORY (employee)
exports.myHistory = async (req, res) => {
  try {
    const userId = req.user._id;

    const records = await Attendance.find({ userId })
      .sort({ date: -1 })
      .limit(200)
      .lean();

    // ensure checkInTime/checkOutTime are strings (safe)
    const normalized = records.map((r) => ({
      ...r,
      checkInTime: r.checkInTime ? String(r.checkInTime) : null,
      checkOutTime: r.checkOutTime ? String(r.checkOutTime) : null,
    }));

    return res.json(normalized);
  } catch (err) {
    console.error('Error fetching user attendance:', err.message);
    return res.status(500).json({ message: 'Server error' });
  }
};

// MY SUMMARY (employee)
exports.mySummary = async (req, res) => {
  try {
    const userId = req.user._id;
    const { month } = req.query; // Example: '2025-11'

    const query = { userId };

    // If a month is provided, match dates starting with YYYY-MM
    if (month) {
      query.date = new RegExp(`^${month}`);
    }

    const records = await Attendance.find(query).lean();

    // Prepare summary
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

    return res.json(summary);
  } catch (err) {
    console.error('Error generating summary:', err.message);
    return res.status(500).json({ message: 'Server error' });
  }
};

// ALL ATTENDANCE (manager)
exports.allAttendance = async (req, res) => {
  try {
    const records = await Attendance.find()
      .populate('userId', 'name email employeeId department')
      .sort({ date: -1 })
      .limit(1000)
      .lean();

    return res.json(records);
  } catch (err) {
    console.error('Error fetching all attendance:', err.message);
    return res.status(500).json({ message: 'Server error' });
  }
};

// EXPORT CSV
exports.exportCSV = async (req, res) => {
  try {
    const records = await Attendance.find()
      .populate('userId', 'name email employeeId department')
      .lean();

    const header = 'employeeId,name,email,department,date,checkIn,checkOut,status,totalHours\n';

    const lines = records
      .map((r) =>
        [
          r.userId?.employeeId || '',
          r.userId?.name || '',
          r.userId?.email || '',
          r.userId?.department || '',
          r.date,
          r.checkInTime || '',
          r.checkOutTime || '',
          r.status,
          r.totalHours || 0,
        ].join(',')
      )
      .join('\n');

    const csv = header + lines;

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=attendance.csv');

    return res.send(csv);
  } catch (err) {
    console.error('CSV export error:', err.message);
    return res.status(500).json({ message: 'Server error' });
  }
};

// TODAY TEAM STATUS (manager)
exports.todayTeamStatus = async (req, res) => {
  try {
    const date = todayStr();

    const present = await Attendance.find({ date })
      .populate('userId', 'name employeeId');

    return res.json({ present });
  } catch (err) {
    console.error('Error fetching today team status:', err.message);
    return res.status(500).json({ message: 'Server error' });
  }
};

// MANAGER: GET ATTENDANCE OF SPECIFIC EMPLOYEE
exports.employeeAttendance = async (req, res) => {
  try {
    const { id } = req.params;

    const employee = await User.findById(id).select('name email employeeId department');
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    const records = await Attendance.find({ userId: id })
      .sort({ date: -1 })
      .limit(200)
      .lean();

    return res.json({
      employee,
      attendance: records,
    });
  } catch (err) {
    console.error('Error fetching employee attendance:', err.message);
    return res.status(500).json({ message: 'Server error' });
  }
};

// TEAM SUMMARY
exports.teamSummary = async (req, res) => {
  try {
    const records = await Attendance.find().populate('userId', 'name email employeeId department').lean();

    const summary = {};

    records.forEach((r) => {
      const userId = r.userId?._id;

      if (!summary[userId]) {
        summary[userId] = {
          name: r.userId?.name,
          email: r.userId?.email,
          employeeId: r.userId?.employeeId,
          department: r.userId?.department,
          present: 0,
          absent: 0,
          late: 0,
          halfDay: 0,
          totalHours: 0,
        };
      }

      if (r.status === 'present') summary[userId].present++;
      if (r.status === 'absent') summary[userId].absent++;
      if (r.status === 'late') summary[userId].late++;
      if (r.status === 'half-day') summary[userId].halfDay++;

      summary[userId].totalHours += r.totalHours || 0;
    });

    return res.json(summary);
  } catch (err) {
    console.error('Error generating team summary:', err.message);
    return res.status(500).json({ message: 'Server error' });
  }
};

// EMPLOYEE — Today's check-in status
exports.employeeTodayStatus = async (req, res) => {
  try {
    const userId = req.user._id;
    const date = todayStr();

    const record = await Attendance.findOne({ userId, date }).lean();

    if (!record) {
      return res.json({
        checkedIn: false,
        message: "Not checked in today"
      });
    }

    // return checkedIn boolean plus the record (string ISO times)
    return res.json({
      checkedIn: true,
      record: {
        ...record,
        checkInTime: record.checkInTime ? String(record.checkInTime) : null,
        checkOutTime: record.checkOutTime ? String(record.checkOutTime) : null,
      }
    });
  } catch (err) {
    console.error('Employee today status error:', err.message);
    return res.status(500).json({ message: 'Server error' });
  }
};
