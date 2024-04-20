const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User'); // Make sure the path matches the location of your User model
const router = express.Router();

router.post('/register', async (req, res) => {
    console.log("Registering user:", req.body);
    try {
        
        const user = new User({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        });
        const newUser = await user.save();
        console.log("User registered:", newUser);
        res.status(201).json(newUser);
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ message: "Error registering user", error: error.message });
    }
});


// Login User
router.post('/login', async (req, res) => {
    try {
        // Retrieve the user by email
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            // If no user is found, return an error
            return res.status(404).json({ message: "User not found" });
        }

        // Log the user's email and plaintext password for debugging
        console.log("Email:", user.email, "Password:", user.password);

        // Compare the plaintext passwords
        if (req.body.password !== user.password) {
            // If passwords do not match, return an error
            return res.status(401).json({ message: "Invalid password" });
        }

        // If the password is correct, proceed with a successful login response
        res.status(200).json({ message: "Logged in successfully" });
    } catch (error) {
        // Log any server errors and return a 500 status code
        console.error("Login error:", error);
        res.status(500).json({ message: "Login error", error: error.message });
    }
});




// Get all users
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
