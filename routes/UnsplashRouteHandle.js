import express from 'express';
import axios from 'axios';
import { generateOrValidateUser } from '../jwt.js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

// In-memory rate limit tracking (you can replace this with Redis for production)
let userRequests = {}; // { userID: { requestCount: number, lastReset: timestamp } }

// API route to fetch random images from Unsplash
router.get('/:query', generateOrValidateUser, async (req, res) => {
    const userID = req.userID;
    const query=req.params.query;
    const currentDate = new Date().toISOString().split('T')[0]; // Reset count daily

    // Initialize user if not present
    if (!userRequests[userID]) {
        userRequests[userID] = { requestCount: 0, lastReset: currentDate };
    }

    const userData = userRequests[userID];

    // If it's a new day, reset the request count
    if (userData.lastReset !== currentDate) {
        userData.requestCount = 0;
        userData.lastReset = currentDate;
    }

    // If user exceeds the limit
    if (userData.requestCount >= 1) {
        return res.status(403).json({
            message: 'You have exceeded your daily limit. Please create an account and visit Unsplash.',
            redirect: 'https://unsplash.com'
        });
    }

    // Increment request count
    userData.requestCount += 1;
    console.log(query);
    try {
        // Fetch random image from Unsplash
        const response = await axios.get(`https://api.unsplash.com/search/photos`, {
            params: {
                query: query,  
                client_id: UNSPLASH_ACCESS_KEY,
                per_page: 5 // Fetch top 5 images
            }
        });  
        
        
        res.json(response.data);  // Send the image data as the response
    } catch (error) {
        console.error("❌ Unsplash API Error:", error.response?.data || error.message);
        res.status(500).json({ message: 'Failed to fetch images from Unsplash.', error: error.response?.data || error.message });
    }
});

export default router;