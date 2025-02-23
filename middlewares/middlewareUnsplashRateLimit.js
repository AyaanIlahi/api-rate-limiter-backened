const userRequests = {}; // { userID: { requestCount: number, lastReset: timestamp } }

/**
 * Middleware to enforce API rate limits (1 request per day per user)
 */
export const rateLimitMiddleware = (req, res, next) => {
    const userID = req.userID;
    const currentDate = new Date().toISOString().split('T')[0];

    // Initialize user if not present
    if (!userRequests[userID]) {
        userRequests[userID] = { requestCount: 0, lastReset: currentDate };
    }

    const userData = userRequests[userID];

    // Reset request count if it's a new day
    if (userData.lastReset !== currentDate) {
        userData.requestCount = 0;
        userData.lastReset = currentDate;
    }
    console.log(userRequests);
    // Enforce rate limit
    if (userData.requestCount >= 1) {
        return res.status(403).json({
            message: 'You have exceeded your daily limit. Please create an account and visit Unsplash.',
            redirect: 'https://unsplash.com'
        });
    }

    // Increment request count
    userData.requestCount += 1;
    next(); // Pass control to the next middleware
};