import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import { validateUser } from '../middlewares/middlewareValidate.js';
import { rateLimitMiddleware } from '../middlewares/middlewareUnsplashRateLimit.js';

dotenv.config();
const router = express.Router();
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

// ✅ Route to search images from Unsplash (passes through both middlewares)
router.get('/:query', validateUser, rateLimitMiddleware, async (req, res) => {
    const query = req.params.query;
    
    console.log(`🔍 Searching Unsplash for: ${query}`);

    try {
        // Fetch images from Unsplash
        const response = await axios.get(`https://api.unsplash.com/search/photos`, {
            params: {
                query: query,
                client_id: UNSPLASH_ACCESS_KEY,
                per_page: 5 // Fetch top 5 images
            }
        });

        res.json(response.data); // ✅ Send image search results
    } catch (error) {
        console.error("❌ Unsplash API Error:", error.response?.data || error.message);
        res.status(500).json({ message: 'Failed to fetch images from Unsplash.', error: error.response?.data || error.message });
    }
});

export default router;