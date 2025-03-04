import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Middleware to validate a user's JWT token
 */
export const validateUser = (req, res, next) => {
    const token = req.cookies.token || req.headers['authorization'];  // JWT from cookie or header
    if (!token) {
        return res.status(400).json({ message: 'No Token provided. Please create a Token.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);  //Verify JWT
        req.userID = decoded.userID;  //Extract UUID instead of IP
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid token or Expired token' });
    }
};