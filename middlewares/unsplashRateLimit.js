const unsplashRequests = {}; // { userID: { requestCount: number, lastReset: timestamp } }

/**
 * Middleware to enforce API rate limits (1 request per day per user)
 */
export const rateLimitUnsplash = (req, res, next) => {
    const userID = req.userID;  // ✅ Unique user ID from token

    if (!unsplashRequests[userID]) {
        unsplashRequests[userID] = { requestCount: 0};
    }

    const userData = unsplashRequests[userID];

    if (userData.requestCount >= 2) {  // ✅ Unsplash API limit: 10 requests per day
        return res.status(403).json({ message: 'Unsplash API rate limit exceeded. Try again tomorrow!' });
    }

    userData.requestCount += 1;
    console.log(unsplashRequests);
    next();
};