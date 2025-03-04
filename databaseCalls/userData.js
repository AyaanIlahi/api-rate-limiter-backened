import { redis } from './connections.js';

//Get user data from Redis
export const getData = async (userID) => {
  const userKey = `user:${userID}`;

  try {
    const userData = await redis.json.get(userKey); //Retrieve as JSON

    if (!userData) return null; // If no data exists, return null
    
    console.log("parsed data from redis",userData);
    return userData;
  } catch (err) {
    console.error('Error fetching user data from Redis:', err);
    throw err;
  }
};

//Store or Reset user data in Redis (JSON format)
export const setData = async (userID,userData) => {
  const userKey = `user:${userID}`;
  
  try {
    await redis.json.set(userKey, "$", userData); //Store as JSON
    await redis.expire(userKey, 86400); //Set expiration to 1 day
    console.log(`🔄 User ${userID} data stored successfully.`);
  } catch (err) {
    console.error('Error resetting user data:', err);
    throw err;
  }
};