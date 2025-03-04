import {getData,setData} from '../databaseCalls/userData.js';

export const rateLimitUnsplash =async (req, res, next) => {
    const userID = req.userID;  //Unique user ID from token
    const userKey = `user:${userID}`;

    let userData=await getData(`user:${userID}`);
    if (userData===null) {
        userData={
            pokeCount: 0,
            unsplCount: 0,
        };
    }

    if (userData.unsplCount >= 4) {  //Unsplash API limit: 2 requests per day
        return res.status(403).json({ message: 'Unsplash API rate limit exceeded. Try again tomorrow!' });
    }

    userData.unsplCount += 1;
    await setData(userKey,userData);
    next();
};