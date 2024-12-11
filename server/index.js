require('dotenv').config(); // Load environment variables from .env

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const EmployeeModel = require("./models/Employee");

const app = express();

// CORS Options
const allowedOrigins = [
    'https://taj-mern-stack.netlify.app',
    'http://localhost:3001',
    'http://localhost:5173',
];

const corsOptions = {
    origin: (origin, callback) => {
        console.log(`Origin: ${origin}`);
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            console.log('CORS allowed');
            callback(null, true);
        } else {
            console.log('CORS blocked');
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true, // Allow cookies and other credentials
    optionsSuccessStatus: 200, // For legacy browsers
};

// Middleware
app.use(express.json());
app.use(cors(corsOptions)); // Apply CORS middleware

// Log all incoming requests (for debugging)
app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.url}`);
    next();
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error("MongoDB connection error:", err));

// Generate JWT Token
const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

// Register Route
app.post("/register", async (req, res) => {
    const { name, email, password } = req.body;

    try {
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

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Incorrect password" });
        }

        const token = generateToken(user._id);
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
        next();
    } catch (err) {
        console.error("Invalid or expired token:", err);
        res.status(401).json({ success: false, message: "Invalid or expired token" });
    }
};

// Example Protected Route
app.get("/protected", authenticate, (req, res) => {
    res.json({ success: true, message: "This is a protected route", userId: req.userId });
});

// Handle preflight requests
app.options('*', cors(corsOptions));

// Start server
const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
