const User = require('../models/UserSchema');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config()

const secretKey = process.env.SECRET_KEY || "1234";


exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validate required fields
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Provide all fields " });
        }
        
        // Normalize email to lowercase (schema also does this, but we need it for the duplicate check)
        const normalizedEmail = email.trim().toLowerCase();
        
        // Check for existing user with normalized email
        const existingUser = await User.findOne({ email: normalizedEmail });
        if (existingUser) {
            return res.status(409).json({ message: "User already exists" });
        }
        
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Create user - schema will handle trimming and validation
        const newUser = new User({
            name: name.trim(), // Trim name as schema expects
            email: normalizedEmail, // Use normalized email
            password: hashedPassword,
            role: "customer" // Force all registrations to be customers only
        });

        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });

    } catch (error) {
        console.error("Registration error:", error);
        
        // Handle Mongoose validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message).join(', ');
            return res.status(400).json({ message: messages || "Validation error", error: error.message });
        }
        
        // Handle duplicate key error (unique constraint violation)
        if (error.code === 11000) {
            return res.status(409).json({ message: "User already exists" });
        }
        
        return res.status(400).json({ message: error.message || "Error registering user", error: error.message });
    }
};

exports.login = async (req, res) => {
            try {
              const { email, password } = req.body;
            if(!email||!password){
                return res.status(400).json({ message: "Enter Valid Email or Password" });
            }
              // Normalize email to lowercase to match how it's stored in database
              const normalizedEmail = email.trim().toLowerCase();
              const user = await User.findOne({ email: normalizedEmail });
              if (!user) {
                return res.status(404).json({ message: "User not found" });
              }
              const isMatch = await bcrypt.compare(password, user.password);
              if (!isMatch) {
                return res.status(401).json({ message: "Invalid password" });
              }
              const payload = {
                id:    user._id.toString(), // Convert to string for JWT consistency
                role:  user.role,
                name:  user.name,
                email: user.email
              };
              const token = jwt.sign(payload, secretKey, { expiresIn: "1h" });
              return res.status(200).json({ message: "Login successful", token,user:payload });
            } catch (error) {
              return res.status(500).json({ error: error.message });
            }
          };

exports.forgetPassword = async (req, res) => {
            try {
                const email = req.body.email;
                const newPassword = req.body.password; 
                if(!email||!newPassword){
                    return res.status(400).json({ message: "Enter Valid Email or Password" });
                }
                // Normalize email to lowercase to match how it's stored in database
                const normalizedEmail = email.trim().toLowerCase();
                const user = await User.findOne({ email: normalizedEmail });
                if (!user) {
                    return res.status(404).json({ message: "User not found" });
                }
                const hashedPassword = await bcrypt.hash(newPassword, 10);
                user.password = hashedPassword;
                await user.save();
                res.status(200).json({ message: "Password updated successfully" });
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        };
          
         



exports.logout = async (req, res) => {
    try {
        
        res.clearCookie('token');
        return res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};