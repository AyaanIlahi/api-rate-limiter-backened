import express from 'express';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();

// Middleware to generate or validate the unique user ID
export const generateOrValidateUser = (req, res, next) => {
    const token = req.cookies.token || req.headers['authorization'];  // JWT from cookie or header
    if (!token) {
        return res.status(400).json({ message: 'No Token provided. Please create a Token.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);  // Verify JWT
        req.userID = decoded.userID;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid token.' });
    }
};

//Route to generate a JWT (user creation)
router.get('/', (req, res) => {
    console.log("🔍 Checking for existing token...");

    // ✅ Check if token exists in cookies
    const existingToken = req.cookies.token;

    if (existingToken) {
        try {
            // ✅ Verify if the token is valid
            const decoded = jwt.verify(existingToken, process.env.JWT_SECRET);
            console.log("✅ Existing valid token found:", decoded);

            return res.json({ message: 'You already have a valid token!', token: existingToken });
        } catch (err) {
            console.warn("⚠️ Token expired or invalid. Generating a new one...");
        }
    }

    // ✅ If no valid token, generate a new one
    const userID = req.ip.toString(); 
    const newToken = jwt.sign({ userID }, process.env.JWT_SECRET, { expiresIn: '1d' });

    // ✅ Store new token in HTTP-only cookie
    res.cookie('token', newToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

    res.json({ message: 'New token created successfully!', token: newToken });
});

export default router;