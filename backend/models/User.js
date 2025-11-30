const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },

  email: { type: String, required: true, unique: true },

  password: { type: String, required: true },

  role: {
    type: String,
    enum: ["Employee", "Manager"],
    default: "Employee",
  },

  employeeId: {
    type: String,
    required: function () {
      return this.role === "Employee";
    },
    sparse: true,
    unique: false,
  },

  department: { type: String, required: true },
});

// ---------- FIXED PASSWORD HASHING ----------
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 10);
});
// --------------------------------------------

module.exports = mongoose.model("User", userSchema);
