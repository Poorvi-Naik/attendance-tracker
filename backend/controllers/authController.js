// controllers/authController.js
console.log("Loaded User.js from:", require.resolve("../models/User"));

const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// ---------------- REGISTER ------------------
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, employeeId, department } = req.body;

    const finalEmployeeId = role === "Employee" ? employeeId : null;

    const user = new User({
      name,
      email,
      password,   // password hashing happens in User.js pre-save hook
      role,
      employeeId: finalEmployeeId,
      department,
    });

    await user.save();

    return res.json({ message: "Registration successful" });
  } catch (err) {
    console.error("Registration error:", err);
    return res.status(500).json({
      message: "Server error during registration",
      error: err.message
    });
  }
};



// ---------------- LOGIN ------------------
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });

    // FIXED: Use { id: user._id } so it matches authMiddleware
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "devsecret",
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        employeeId: user.employeeId
      }
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error during login" });
  }
};



// ---------------- GET LOGGED-IN USER --------------
exports.me = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json(user);
  } catch (err) {
    console.error("Fetch user error:", err);
    res.status(500).json({ message: "Failed to fetch user data" });
  }
};
