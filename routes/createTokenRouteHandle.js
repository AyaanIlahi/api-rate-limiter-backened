import express from 'express';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';  // ✅ Import UUID generator

dotenv.config();
const router = express.Router();

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
    const userID = uuidv4();  // Generate a unique UUID for the user
    console.log("user id during creation",userID);
    const newToken = jwt.sign({ userID }, process.env.JWT_SECRET, { expiresIn: '1d' });

    // ✅ Store new token in HTTP-only cookie
    res.cookie('token', newToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 86400000 });

    res.json({ message: 'New token created successfully!', token: newToken });
});

// ✅ Logout Route (Deletes Token)
router.get('/logout', (req, res) => {
    res.clearCookie('token'); // Deletes the token cookie
    res.json({ message: "Token has been deleted!" });
});

export default router;