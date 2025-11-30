const mongoose = require('mongoose');

// Schema to track daily attendance for each user
const attendanceSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },

  // Attendance date stored as 'YYYY-MM-DD'
  date: { 
    type: String, 
    required: true 
  },

  checkInTime: { 
    type: String 
  },

  checkOutTime: { 
    type: String 
  },

  status: { 
    type: String, 
    enum: ['present', 'absent', 'late', 'half-day'],
    default: 'present' 
  },

  totalHours: { 
    type: Number, 
    default: 0 
  },

  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Ensure a user cannot have duplicate attendance for the same date
attendanceSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
