import {getData,setData} from '../databaseCalls/userData.js';

export const rateLimitUnsplash =async (req, res, next) => {
    const userID = req.userID;  //Unique user ID from token
    const userKey = `user:${userID}`;

    let userData=await getData(`user:${userID}`);
    if (userData===null) {
        userData={
            pokemon: {count:0, expireTime:0},
            unsplCount: 0,
        };
    }

    if (userData.unsplCount >= 5) {  //Unsplash API limit: 5 requests per day
        return res.status(403).json({ message: 'Unsplash API rate limit exceeded. Try again tomorrow!' });
    }

    userData.unsplCount += 1;
    await setData(userKey,userData);
    next();
};