// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const EmployeeModel = require("./models/Employee");

// Load environment variables from .env file
dotenv.config();

// Initialize express app
const app = express();

// Middleware
app.use(express.json());  // To parse incoming JSON requests
app.use(cors());  // Allow cross-origin requests (CORS)

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/employee", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

// Register Route - Create new employee
app.post("/register", (req, res) => {
  const { name, email, password } = req.body;

  // Hash password before saving it
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Server error while hashing password" });
    }

    // Create the user with hashed password
    EmployeeModel.create({name,  email, password: hashedPassword })
      .then((employee) => res.json({ success: true, employee }))
      .catch((err) => res.status(500).json({ success: false, message: err.message }));
  });
});

// Login Route - Validate user and generate JWT token
app.post("/login", (req, res) => {
    const { email, password } = req.body;  // Getting email and password from the request body
  
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }
  
    EmployeeModel.findOne({ email })
      .then((user) => {
        if (user) {
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
              return res.status(500).json({ success: false, message: "Server error while comparing passwords" });
            }
  
            if (isMatch) {
              const token = generateToken(user._id);  // Generate JWT token if passwords match
              res.json({ success: true, token });
            } else {
              res.status(400).json({ success: false, message: "Incorrect password" });
            }
          });
        } else {
          res.status(404).json({ success: false, message: "User not found" });
        }
      })
      .catch((err) => {
        console.error("Login error:", err);
        res.status(500).json({ success: false, message: "Internal server error" });
      });
  });
  

// Middleware to authenticate JWT token (for protected routes)
const authenticate = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1]; // Format: Bearer <token>

  if (!token) {
    return res.status(401).json({ success: false, message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;  // Attach userId to the request object
    next();  // Proceed to the next middleware or route handler
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

// Example of a Protected Route
app.get("/protected", authenticate, (req, res) => {
  res.json({ success: true, message: "This is a protected route", userId: req.userId,  });
});

// Start the server
app.listen(3001, () => {
  console.log("Server running on port 3001");
});
