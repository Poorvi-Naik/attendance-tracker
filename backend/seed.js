require('dotenv').config();

const mongoose = require('mongoose');
const connectDB = require('./config/db');

const User = require('./models/User');
const Attendance = require('./models/Attendance');
const bcrypt = require('bcryptjs');

(async () => {
  try {
    console.log('⏳ Connecting to MongoDB...');
    await connectDB();

    console.log('🧹 Clearing existing Users and Attendance data...');
    await User.deleteMany({});
    await Attendance.deleteMany({});

    console.log('👤 Creating sample users...');

    // Generate hashed password for all demo users
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    // -------------------- Manager --------------------
    const manager = await User.create({
      name: 'Alice Manager',
      email: 'manager@example.com',
      password: hashedPassword,
      role: 'manager',
      employeeId: 'MGR001',
      department: 'Management'
    });

    // -------------------- Employees --------------------
    const emp1 = await User.create({
      name: 'Bob Employee',
      email: 'bob@example.com',
      password: hashedPassword,
      role: 'employee',
      employeeId: 'EMP001',
      department: 'Sales'
    });

    const emp2 = await User.create({
      name: 'Carol Employee',
      email: 'carol@example.com',
      password: hashedPassword,
      role: 'employee',
      employeeId: 'EMP002',
      department: 'Development'
    });

    // -------------------- Attendance Records --------------------
    const today = new Date().toISOString().slice(0, 10);

    await Attendance.create({
      userId: emp1._id,
      date: today,
      checkInTime: new Date().toISOString(),
      checkOutTime: new Date().toISOString(),
      status: 'present',
      totalHours: 8
    });

    await Attendance.create({
      userId: emp2._id,
      date: today,
      checkInTime: new Date().toISOString(),
      checkOutTime: new Date().toISOString(),
      status: 'late',
      totalHours: 6
    });

    console.log('Seeding complete!');
    console.log('\nLogin Credentials:');
    console.log('-------------------------------------');
    console.log('Manager:   manager@example.com / password123');
    console.log('Employee1: bob@example.com     / password123');
    console.log('Employee2: carol@example.com   / password123');
    console.log('-------------------------------------');

    process.exit(0);

  } catch (err) {
    console.error('Error during seeding:', err.message);
    process.exit(1);
  }
})();
