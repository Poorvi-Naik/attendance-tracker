const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');
const attendanceController = require('../controllers/attendanceController');

// Employee: Check-in
router.post('/checkin', authMiddleware, attendanceController.checkIn);

// Employee: Check-out
router.post('/checkout', authMiddleware, attendanceController.checkOut);

// Employee: My attendance history
router.get('/my-history', authMiddleware, attendanceController.myHistory);

// Employee: My summary
router.get('/my-summary', authMiddleware, attendanceController.mySummary);

// Employee: Today's personal status
router.get('/today', authMiddleware, attendanceController.employeeTodayStatus);

// Manager: View all attendance
router.get('/all', authMiddleware, attendanceController.allAttendance);

// Manager: Export CSV
router.get('/export', authMiddleware, attendanceController.exportCSV);

// Manager: Team today's status (renamed)
router.get('/team-today', authMiddleware, attendanceController.todayTeamStatus);

// Manager: Employee-specific record
router.get('/employee/:id', authMiddleware, attendanceController.employeeAttendance);

// Manager: Team summary
router.get('/summary', authMiddleware, attendanceController.teamSummary);

module.exports = router;
