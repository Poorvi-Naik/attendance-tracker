# Attendance Tracker – MERN Stack

A full-stack Employee Attendance Management System built with **MongoDB, Express.js, React, Node.js (MERN)**.

---

#  Features

## Employee
- Check In / Check Out
- Daily attendance status
- Monthly summary
- Personal attendance history

## Manager
- View all employee attendance
- Filter by date, employee, and status
- Export attendance as CSV
- Daily team status
- Monthly team summary

# Tech Stack

**Frontend:** React (Bootstrap UI)  
**Backend:** Node.js + Express  
**Database:** MongoDB + Mongoose  
**Auth:** JWT  
**Styling:** Bootstrap  


# 📁 Project Structure

attendance-tracker/
│── backend/ # Node + Express API
│── frontend/ # React Application
│── README.md
│── .gitignore
│── package.json



## Installation

## 1️⃣ Cloned the Repository


git clone https://github.com/Poorvi-Naik/attendance-tracker.git
cd attendance-tracker




# Backend Setup

cd backend
npm install
Created a .env file inside /backend with:
MONGO_URI=mongodb://localhost:27017/attendance
JWT_SECRET=your_jwt_secret
PORT=5000
Run the backend server:


Copy code
npm start

---

# Frontend Setup

cd ../frontend
npm install
npm start
The frontend will run at:
http://localhost:3000


# 🔑 Environment Variables

### Backend `.env`

MONGO_URI=mongodb://localhost:27017/attendance
JWT_SECRET=your_secret_here
PORT=5000

REACT_APP_API=http://localhost:5000


# Seed Users

### Manager
email: manager@gmail.com
password: manager123



## Employee
email: employee@gmail.com
password: employee123
