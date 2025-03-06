import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

/**
 * Middleware to validate a user's JWT token
 */
export const validateUser = (req, res, next) => {
    let token = req.headers["authorization"]; // Get token from Authorization header

    if (!token) {
        return res.status(401).json({ message: "❌ No token provided. Please create a token." });
    }

    // If token is in Authorization header, remove "Bearer " prefix
    if (token.startsWith("Bearer ")) {
        token = token.slice(7).trim();
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify JWT
        req.userID = decoded.userID; // Attach user ID to request object
        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(403).json({ message: "⏳ Token expired. Please log in again." });
        }
        return res.status(403).json({ message: "🚫 Invalid token. Access denied." });
    }
};