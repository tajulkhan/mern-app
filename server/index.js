// server.js
require('dotenv').config();  // Load environment variables from .env

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const EmployeeModel = require("./models/Employee");

const app = express();
const corsOptions = require('./config/corsOptions');
// Middleware
app.use(express.json());
app.use(cors(corsOptions));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
})
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

// Register Route
app.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) return res.status(500).json({ success: false, message: "Error hashing password" });
    EmployeeModel.create({ name, email, password: hashedPassword })
      .then((employee) => res.json({ success: true, employee }))
      .catch((err) => res.status(500).json({ success: false, message: err.message }));
  });
});

// Login Route
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ success: false, message: "Email and password are required" });

  EmployeeModel.findOne({ email })
    .then((user) => {
      if (user) {
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) return res.status(500).json({ success: false, message: "Error comparing passwords" });
          if (isMatch) {
            const token = generateToken(user._id);
            res.json({ success: true, token });
          } else {
            res.status(400).json({ success: false, message: "Incorrect password" });
          }
        });
      } else {
        res.status(404).json({ success: false, message: "User not found" });
      }
    })
    .catch((err) => res.status(500).json({ success: false, message: "Internal server error" }));
});

// Middleware to authenticate JWT token (for protected routes)
const authenticate = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) return res.status(401).json({ success: false, message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

// Example Protected Route
app.get("/protected", authenticate, (req, res) => {
  res.json({ success: true, message: "This is a protected route", userId: req.userId });
});

// Start server
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
