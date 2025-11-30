const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');
const dashboardController = require('../controllers/dashboardController');

// ---------------------- DASHBOARD ROUTES ----------------------

// Employee dashboard (for logged-in employee)
router.get('/employee', authMiddleware, dashboardController.employeeDashboard);

// Manager dashboard (for logged-in manager)
router.get('/manager', authMiddleware, dashboardController.managerDashboard);

module.exports = router;
