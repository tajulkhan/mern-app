require('dotenv').config(); // Load environment variables from .env

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const EmployeeModel = require("./models/Employee");

const app = express();
// Debug log
console.log('JWT_SECRET:', process.env.JWT_SECRET);  

// CORS Options
const allowedOrigins = [
    'https://taj-mern-stack.netlify.app',
    'http://localhost:3001',
    'http://localhost:5173',
];

const corsOptions = {
    origin: (origin, callback) => {
        console.log(`Received CORS request from origin: ${origin}`);
        if (!origin || allowedOrigins.includes(origin)) {
            console.log('CORS allowed');
            callback(null, true);
        } else {
            console.log('CORS blocked for this origin');
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true, // Allow credentials (cookies, etc.)
    optionsSuccessStatus: 200, // For legacy browsers
};

app.use(express.json());
app.use(cors(corsOptions)); // Apply CORS middleware

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
})
  .then(() => {
      console.log("MongoDB connected successfully");
  })
  .catch((err) => {
      console.error("MongoDB connection error:", err.message);
      process.exit(1);  // Exit process with failure
  });

// Generate JWT Token
const generateToken = (userId, name) => {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined");
    }
    return jwt.sign({ userId, name }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

// Register Route
app.post("/register", async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const existingUser = await EmployeeModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "Email already in use" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const employee = await EmployeeModel.create({ name, email, password: hashedPassword });

        res.status(201).json({ success: true, employee });
    } catch (err) {
        console.error("Error during registration:", err);
        res.status(500).json({ success: false, message: err.message });
    }
});

// Login Route
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email and password are required" });
        }

        const user = await EmployeeModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ success: false, message: "Incorrect password" });
        }

        const token = generateToken(user._id, user.name);
        res.json({ success: true, token });
    } catch (err) {
        console.error("Error during login:", err);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

// Middleware to authenticate JWT token
const authenticate = (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ success: false, message: "No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        req.userName = decoded.name;
        next();
    } catch (err) {
        console.error("Invalid or expired token:", err);
        res.status(401).json({ success: false, message: "Invalid or expired token" });
    }
};

// Protected Route Example
app.get("/protected", authenticate, (req, res) => {
    res.json({ success: true, message: "This is a protected route", userId: req.userId, userName: req.userName  });
});

// Logout Route
app.post("/logout", (req, res) => {
    res.json({ success: true, message: "You have logged out" });
});

// Start server
const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
