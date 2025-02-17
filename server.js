const express = require('express');
const redis = require('redis');
const app = express();
const port = process.env.PORT || 3000;

// Set up Redis client
const redisClient = redis.createClient({
    host: 'localhost', // use the host or Redis service URL if using managed Redis
    port: 6379
});

// Check Redis connection
redisClient.on('connect', () => {
    console.log('Connected to Redis...');
});
// Middleware to handle rate-limiting
const rateLimiter = (req, res, next) => {
    const userKey = req.ip; // using IP to track user
    const rateLimit = 5; // Allow 5 requests per minute

    // Check how many requests the user has made in the last minute
    redisClient.get(userKey, (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Internal server error' });
        }

        if (data && data >= rateLimit) {
            return res.status(429).json({ error: 'Rate limit exceeded, try again later.' });
        }
        // Increment the user's request count and set expiry time to 60 seconds
        redisClient.multi()
            .incr(userKey)
            .expire(userKey, 60)
            .exec((err, results) => {
                if (err) {
                    return res.status(500).json({ error: 'Internal server error' });
                }
                next(); // Proceed to the API route
            });
    });
};
// Example API route
app.get('/api', rateLimiter, (req, res) => {
    res.json({ message: 'You have accessed the API!' });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});