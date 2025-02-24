import { redis } from './databaseCalls/connections.js';

const rateLimiter = async (req, res, next) => {
    try {
        const userKey = `rate_limit:${req.ip}`; // Unique key per user IP
        const rateLimit = 5; // Allow 5 requests per minute

        // Get the current request count
        let requests = await redis.get(userKey);
        requests = requests ? parseInt(requests) : 0;

        if (requests >= rateLimit) {
            return res.status(429).json({ error: 'Rate limit exceeded, try again later.' });
        }

        // Increment the request count and set expiry time to 60 seconds
        await redis.set(userKey, requests + 1, { ex: 60 });

        console.log("I am in middleware"); // Debugging log
        next(); // Proceed to the API route

    } catch (err) {
        console.error('Redis Error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
export default rateLimiter;