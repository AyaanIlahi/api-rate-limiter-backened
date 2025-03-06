import express from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();
const router = express.Router();

router.get('/', (req, res) => {
    console.log("🔍 Checking for existing token...");

    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    console.log(authHeader);
    let existingToken = authHeader && authHeader.split(" ")[1]; // Extract token if present

    if (existingToken) {
        try {
            // Verify if the token is valid
            const decoded = jwt.verify(existingToken, process.env.JWT_SECRET);
            console.log("Existing valid token found:", decoded);
            return res.json({ message: 'You already have a valid token!'});
        } catch (err) {
            console.warn("⚠️ Token expired or invalid. Generate a new one.");
        }
    }

    // Generate a new JWT if no valid token
    const userID = uuidv4();
    console.log("🆕 New user ID created:", userID);

    const newToken = jwt.sign({ userID }, process.env.JWT_SECRET, { expiresIn: '1d' });

    // Return token in JSON response (Client stores it in Local Storage)
    res.json({ message: 'New token created successfully! It will expire after one day.',token: newToken});
});

// Logout Route (Frontend removes token) Future Addition
export default router;
