const User = require('../models/UserSchema');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config()

const secretKey = "1234";


exports.register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password || !role) {
            return res.status(400).json({ message: "Provide all fields " });
        }
        
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role
        });

        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });

    } catch (error) {
        res.status(400).json({ message: "Error registering", error: error.message });
    }
};

exports.login = async (req, res) => {
            try {
              const { email, password } = req.body;
            if(!email||!password){
                return res.status(400).json({ message: "Enter Valid Email or Password" });
            }
              const user = await User.findOne({ email });
              if (!user) {
                return res.status(404).json({ message: "User not found" });
              }
              const isMatch = await bcrypt.compare(password, user.password);
              if (!isMatch) {
                return res.status(401).json({ message: "Invalid password" });
              }
              const payload = {
                id:    user._id,
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
                const user = await User.findOne({ email });
                if (!user) {
                    return res.status(404).json({ message: "User not found" });
                }
                const hashedPassword = await bcrypt.hash(newPassword, 10);
                user.password = hashedPassword;
                await user.save();
                res.status(200).json({ message: "Password updated successfully" });
            } catch (error) {
                res.status(500).json({ error: error.message });
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